import amqp from "amqplib";
import logger from "./logger";

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const MAX_RETRIES = 5; // Maximum retries before giving up
let retries = 0;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);

    connection.on("error", (err) => {
      logger.error("RabbitMQ connection error:", err);
      reconnectRabbitMQ();
    });

    connection.on("close", () => {
      logger.warn("RabbitMQ connection closed. Reconnecting...");
      reconnectRabbitMQ();
    });

    channel = await connection.createChannel();
    logger.info("RabbitMQ connected successfully");

    retries = 0; // Reset retry count on successful connection
  } catch (error) {
    logger.error("RabbitMQ Connection Error:", error);
    if (retries < MAX_RETRIES) {
      retries++;
      logger.warn(`Retrying RabbitMQ connection (${retries}/${MAX_RETRIES})...`);
      setTimeout(connectRabbitMQ, 5000);
    } else {
      logger.error("Maximum RabbitMQ connection retries reached. Exiting...");
      process.exit(1);
    }
  }
};

const reconnectRabbitMQ = async () => {
  if (connection) {
    await connection.close();
  }
  connection = null;
  channel = null;
  setTimeout(connectRabbitMQ, 5000);
};

export const createQueue = async (queueName: string) => {
  if (!channel) {
    logger.error("RabbitMQ channel is not initialized!");
    return;
  }
  await channel.assertQueue(queueName, { durable: true }); // Ensures messages persist
  logger.info(` Queue "${queueName}" is ready`);
};

export const sendToQueue = async (queueName: string, message: object) => {
    if (!channel) {
      logger.error(" RabbitMQ channel is not initialized!");
      return;
    }
    const msgBuffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queueName, msgBuffer, { persistent: true });
    logger.info(` Message sent to queue "${queueName}", ${msgBuffer}`);
};

// export const consumeQueue = async <T extends object>(
//   queueName: string,
//   processMessage: (message: T) => Promise<void>
// ) => {
//   try {
//     if (!channel) {
//       throw new Error("RabbitMQ channel is not initialized!");
//     }

//     await channel.assertQueue(queueName, { durable: true });
//     logger.info(`Listening for messages on queue: "${queueName}"...`);

//     channel.consume(
//       queueName,
//       async (msg) => {
//         if (msg) {
//           try {
//             const parsedMessage: T = JSON.parse(msg.content.toString()); // Convert to object
//             logger.info(`Received message:`, parsedMessage);

//             await processMessage(parsedMessage);

//             channel?.ack(msg);
//           } catch (error) {
//             logger.error(`Error processing message: ${error}`);
//             channel?.nack(msg, false, true);
//           }
//         }
//       },
//       { noAck: false }
//     );
//   } catch (error) {
//     logger.error(`Failed to consume queue "${queueName}": ${error}`);
//   }
// }; 



export const consumeQueue = async (queueName: string, callback: (message: any) => Promise<void>) => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized!");
  }

  await channel.assertQueue(queueName, { durable: true });
  logger.info(`Listening for messages on queue: "${queueName}"...`);

  channel.consume(
    queueName,
    async (msg) => {
      if (msg) {
        try {
          const parsedMessage = JSON.parse(msg.content.toString()); // Convert buffer to object
          logger.info(`Received message from "${queueName}":`, parsedMessage);

          await callback(parsedMessage);

          channel?.ack(msg);
        } catch (error) {
          logger.error(`Error processing message from "${queueName}":`, error);
          channel?.nack(msg, false, true);
        }
      }
    },
    { noAck: false }
  );
};



export const closeRabbitMQ = async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
  logger.info(" RabbitMQ connection closed gracefully.");
};

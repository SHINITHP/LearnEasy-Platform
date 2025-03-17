import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import logger from '../../../shared/utils/logger' ;
import emailRoute from './routes/emailRoute';
import { connectRabbitMQ, consumeQueue, createQueue } from '../../../shared/utils/rabbitmq'
import { consumeEmail } from './consumers/emailConsumer';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3003


app.use(express.json()); 
app.use(cors({
    origin: ["http://localhost:4000 , http://localhost:5173"],
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders:["Content-Type", "Authorization"]
}));

// to get the request details
app.use((req, res, next) => {
    if(process.env.NODE_ENV === 'production'){
        logger.info(`Received ${req.method} request to ${req.url}`);
    }else {
        logger.info(`Received ${req.method} request to ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    }

    if (Object.keys(req.body).length > 0 && process.env.NODE_ENV !== 'production') {
        logger.debug(`Request body: ${JSON.stringify(req.body, null, 2)}`);
    }
    next();
})


app.listen(PORT, async () => {
    console.log(`🚀 OTP Service running on port ${PORT}`);
    //connect to RabbitMQ
    await connectRabbitMQ().then(() => {
        createQueue('email_queue');
    });
    await consumeEmail(); // Start RabbitMQ consumer
});
  
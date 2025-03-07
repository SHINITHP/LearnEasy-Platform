import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectRabbitMQ, createQueue } from '../../../shared/utils/rabbitmq'
import logger from '../../../shared/utils/logger';
import otpRoutes from '../src/routes/otpRoutes'
import { consumeOTP } from '../src/consumers/otpConsumer'


dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3002


app.use(express.json()); 
app.use(cors({
    origin: ["http://localhost:4000 , http://localhost:5173"], // Allow all origins (Change this in production)
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

app.use('/otp',otpRoutes);

app.listen(PORT, async () => {
    console.log(`🚀 OTP Service running on port ${PORT}`);
    //connect to RabbitMQ
    await connectRabbitMQ().then(() => {
        createQueue('OtpQueue');
    });
    await consumeOTP(); // Start RabbitMQ consumer
});
  
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session'
import cookieParser from  'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import logger from '../../../shared/utils/logger'
import connectDB from './config/db';
import errorHandler from './middlewares/errorHandler';
import authRoute from './routes/authRoute'
import { connectRabbitMQ, createQueue } from '../../../shared/utils/rabbitmq';


dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

//connect to mongodb
connectDB();

//connect to RabbitMQ
connectRabbitMQ().then(() => {
    createQueue('AuthQueue');
})

app.use(cookieParser());
app.use(express.json()); // Ensure request body is parsed
app.use(helmet());
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


app.use('/auth', authRoute);

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`User Service running on port ${PORT}`)
});
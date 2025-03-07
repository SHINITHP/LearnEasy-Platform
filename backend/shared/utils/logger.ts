import winston, { format } from 'winston';
import dotenv from 'dotenv'; // For environment variables

dotenv.config(); // Load environment variables from .env file

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Default to debug if NODE_ENV is not set
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'api-gateway' },
    transports: [
        new winston.transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

export default logger;
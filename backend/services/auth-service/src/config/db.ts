import mongoose from "mongoose";
import logger from "../../../../shared/utils/logger";

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL!)
        logger.info(`MongoDB Connected Successfull: ${conn.connection.host}`)
    } catch (error: any) {
        logger.error(`MongoDB Connection Error: ${error.message}`);
        throw error; 
    }
}

export default connectDB;
import { createClient } from 'redis';
import logger from './logger';

const client = createClient();
client.connect().catch(error => logger.error("Redis connection error", error));

const expiresIn = 7 * 24 * 60 * 60; // Expiration in seconds

const setRefreshToken = async (userId: string | number, refreshToken: string, expiresIn: number = 7 * 24 * 60 * 60): Promise<void> => {
    try {
        await client.setEx(userId.toString(), expiresIn, refreshToken);
        logger.info(`Stored refresh token in Redis for user: ${userId}`);
    } catch (error) {
        logger.error(`Error storing refresh token in Redis: ${error}`);
        throw error; // Re-throw the error for proper handling
    }
}

const getRefreshToken = async (userId: string | number): Promise<string | null> => {
    try {
        const refreshToken = await client.get(userId.toString());
        return refreshToken;
    } catch (error) {
        logger.error(`Redis Get Error: ${error}`);
        return null;
    }
};

const deleteRefreshToken = async (userId: string | number): Promise<void> => {
    try {
        await client.del(userId.toString());
        logger.info(`Deleted refresh token for user: ${userId}`);
    } catch (error) {
        logger.error(`Error deleting refresh token in Redis: ${error}`);
        throw error;  // Re-throw for handling
    }
};

const setOtp = async (key: string, otp: string, expiresAt = 300) => {
    try {
        await client.setEx(key, expiresAt, otp);
        console.log(`📝 OTP stored in Redis with key: ${key}`);
    } catch (error) {
        console.error(`❌ Error storing OTP in Redis: ${error}`);
        throw error;
    }
};

const getOtp = async (key: string): Promise<string | null> => {
    try {
        const otp = await client.get(key);
        if (otp) {
            console.log(`📦 Retrieved OTP from Redis: ${otp}`);
        } else {
            console.warn(`⚠️ OTP not found in Redis for key: ${key}`);
        }
        return otp;
    } catch (error) {
        console.error(`❌ Redis Get Error: ${error}`);
        return null;
    }
};

const deleteOtp = async (key: string) => {
    try {
        await client.del(key);
        console.log(`🗑️ Deleted OTP for key: ${key}`);
    } catch (error) {
        console.error(`❌ Redis Delete Error: ${error}`);
    }
};

export { setRefreshToken, getRefreshToken, deleteRefreshToken, setOtp, getOtp, deleteOtp }; 
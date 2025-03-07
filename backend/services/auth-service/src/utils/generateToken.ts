import jwt from 'jsonwebtoken';
import logger from '../../../../shared/utils/logger';

interface TokenPayload {
    user: object; // Or number, depending on your user type
}

const generateToken = async (user: object ): Promise<{ accessToken: string; refreshToken: string }> => { // Type user and return value
    try {
        const payload: TokenPayload = { user }; // Create a typed payload object

        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET!, // Non-null assertion (!) - handle missing secret
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_SECRET!, // Non-null assertion (!) - handle missing secret
            { expiresIn: "7d" }
        );

        logger.info(`Tokens generated successfully for user: ${user}`);

        return { accessToken, refreshToken };
    } catch (error) {
        logger.error(`Error generating tokens: ${error}`);
        throw error; // Re-throw the error for proper handling
    }
};

export default generateToken; 
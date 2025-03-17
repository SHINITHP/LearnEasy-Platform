import jwt from 'jsonwebtoken';
import logger from '../../../../shared/utils/logger';

interface TokenPayload {
    userId: string;
    email: string;
}

const generateToken = async (user: TokenPayload ): Promise<{ accessToken: string; refreshToken: string }> => { // Type user and return value
    try {

        const accessToken = jwt.sign(
            user,
            process.env.JWT_SECRET!, // Non-null assertion (!) - handle missing secret
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            user,
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

const verifyJWTToken = (token: string): TokenPayload | null => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    } catch (error: any) {
      logger.error(`Invalid or expired token: ${error.message}`);
      return null;
    }
  };
  

export { generateToken, verifyJWTToken }; 
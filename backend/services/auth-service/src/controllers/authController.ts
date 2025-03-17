import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import logger from '../../../../shared/utils/logger';
import { validateRegister } from '../utils/validation';
import argon2 from 'argon2';
import { setRefreshToken } from '../../../../shared/utils/redisService';
import AuthService from '../services/authServices';
import ApiResponse from '../../../../shared/utils/apiResponse';
import ApiError from '../../../../shared/utils/apiError';
import oauth2Client from '../config/googleConfig';

// Interface for registration request body
interface RegistrationData {
    email: string;
    password: string;
    userName: string;
    confirmPassword: string;
}

// User Registration
const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        logger.info(`Received registration request with data: ${JSON.stringify(req.body)}`);

        const { userName, email, password, confirmPassword } = req.body;
        const result = await AuthService.register({ userName, email, password, confirmPassword })

        ApiResponse.success(res, 'OTP Sended Successfully!', result, 201)
    } catch (error) {
        next(error)// Pass the error to middleware
    }
};

const verfifyOTPAndRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        logger.info(`Received otp verify request with data: ${JSON.stringify(req.body.email)}`);

        const { otp, email } = req.body;
        const result = await AuthService.verifyOTPAndRegisterService(otp, email);
        
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        
        ApiResponse.success(res, 'User registered successfully!', { user: result.user, token: result.token }, 201);
    } catch (error) {
        next(error)// Pass the error to middleware
    }
}

const verifyResetToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        logger.info(`Received verify-reset request with data: ${JSON.stringify(req.query.token)}`);

        const token = req.query.token as string | undefined;

        if(!token){
            return next(new ApiError(403, "No token provided"));
        }

        const result = await AuthService.verifyResetTokenService(token);

        ApiResponse.success(res, "Token is valid", result , 200);
    } catch (error: any) {
        logger.error(`Token verification failed: ${error.message}`);
        next(new ApiError(400, error.message));      
    }

}

const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        logger.info(`Received email to send email: ${JSON.stringify(req.body.email)}`);

        const { email } = req.body;

        const result = await AuthService.sendResetEmail(email);

        logger.info(`Received email to send result: ${result}`);

        ApiResponse.success(res, 'OTP Sended Successfully!', result, 201);

    } catch (error) {
        next(error);
    }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        logger.info(`Received request to reset password: ${JSON.stringify(req.body)}`);

        const { token, newPassword } = req.body;

        const result = await AuthService.resetPasswordService(token, newPassword);

        ApiResponse.success(res, "Password reset successfull", result , 200); 

    } catch (error: any) {
        next(new ApiError(403, error.message));
    }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;
        logger.info(`Refresh Token  called!!, : ${refreshToken}`)

        if (!refreshToken) {
            return next(new ApiError(403, "No token provided"));
        }

        const result = await AuthService.refreshToken(refreshToken)

        ApiResponse.success(res, "New access token generated", { token: result.token, user: result.user } , 200);
    } catch (error: any) {
        console.log('error in refreshTOken',error);
        next(new ApiError(403, error));
    }
};


const googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { code } = req.query;

    if(!code){
        return next(new ApiError(401, 'Authentication failed'));
    }

    logger.info(`Received google login request with data: ${code}`);

    const result = await AuthService.googleAuthUser({ code });

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    
    ApiResponse.success(res, 'User logged successfully!', { user: result.user, token: result.accessToken }, 200);
}

const logout = async(req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { userId } = req.body;
    logger.info(`Received logout request with data: ${userId}`);

    res.clearCookie("refreshToken"); 

    await AuthService.logoutUser(userId);

    ApiResponse.success(res, "Logout successful", 200);
}


const LoginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        logger.info(`Received login request with data: ${JSON.stringify(req.body.email)}`);

        const { email, password} = req.body;
        const result = await AuthService.login({ email, password })

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

        logger.info(`User logged in successfully: ${email}`);

        ApiResponse.success(res, 'User logged successfully!', { user: result.user, token: result.accessToken }, 200);

    } catch (error) {

        if (error instanceof Error) {
            logger.error(`Login failed for email: ${req.body.email}, Error: ${error.message}`);
        } else {
            logger.error(`Login failed for email: ${req.body.email}, Unexpected error: ${JSON.stringify(error)}`);
        }

        next(error)// Pass the error to middleware
    }
}

export { registerUser, LoginUser, resetPassword, verifyResetToken, verfifyOTPAndRegister, forgotPassword, refreshToken, googleAuth, logout };

import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import logger from '../../../../shared/utils/logger';
import { validateRegister } from '../utils/validation';
import argon2 from 'argon2';
import { setRefreshToken } from '../../../../shared/utils/redisService';
import RefreshToken from '../models/RefreshToken';
import AuthService from '../services/authServices';
import ApiResponse from '../../../../shared/utils/apiResponse';

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

const verfifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        logger.info(`Received otp verify request with data: ${JSON.stringify(req.body.email)}`);

        const { otp, email } = req.body;
        const result = await AuthService.verifyOTPAndRegister(otp, email);
        
        ApiResponse.success(res, 'User registered successfully!', result, 201);
    } catch (error) {
        next(error)// Pass the error to middleware
    }
}

const LoginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        logger.info(`Received login request with data: ${JSON.stringify(req.body.email)}`);

        const { email, password} = req.body;
        const result = await AuthService.login({ email, password })

        // console.log("result :", result)
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        logger.info(`User logged in successfully: ${email}`);

        ApiResponse.success(res, 'User loged successfully!', { user: result.user, token: result.accessToken }, 200);

    } catch (error) {

        if (error instanceof Error) {
            logger.error(`Login failed for email: ${req.body.email}, Error: ${error.message}`);
        } else {
            logger.error(`Login failed for email: ${req.body.email}, Unexpected error: ${JSON.stringify(error)}`);
        }

        next(error)// Pass the error to middleware
    }
}

export { registerUser, LoginUser, verfifyOTP };

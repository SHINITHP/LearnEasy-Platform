import User from "../models/User";
import generateToken from "../utils/generateToken";
import { validateRegister } from "../utils/validation";
import argon2  from "argon2";
import { setRefreshToken } from "../../../../shared/utils/redisService";
import RefreshToken from "../models/RefreshToken";
import ApiError from '../../../../shared/utils/apiError';
import logger from "../../../../shared/utils/logger";
import { sendToQueue } from "../../../../shared/utils/rabbitmq";
import { verifyOTP } from "../../../../shared/utils/otpServices";
import TempUser from '../models/TempUser'

interface RegistrationData {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

interface loginData {
    email: string;
    password: string;
}

class AuthService {
    static async register(data: RegistrationData){
        const { userName, email, password, confirmPassword } = data;

        //validate input
        await validateRegister(data);

        //check if the user already exists!
        const isUserExist = await User.findOne({ email });
        if(isUserExist) throw new ApiError(400, 'Email already exists.');

        await sendToQueue('OtpQueue',{email});

        await TempUser.create({
            userName, 
            email, 
            password
        });

        return { email , message: "OTP sent to your email. Please verify to continue." };

    }

    static async verifyOTPAndRegister(otp: string, email: string){
        const isValidOTP = await verifyOTP(email, otp);
        if (!isValidOTP) throw new ApiError(400, "Invalid or expired OTP.");

        const userData = await TempUser.findOne({ email }) 
        if (!userData) throw new ApiError(404, "User data not found. Please register again.");

        // Create user after OTP verification
        const user = await User.create({
            userName: userData.userName,
            email: userData.email,
            password: userData.password
        });
    
        logger.info(`User registered successfully: ${user._id}`);

        // Generate tokens
        const { accessToken, refreshToken } = await generateToken(user);

        // Store refresh token in Redis
        await setRefreshToken(user._id.toString(), refreshToken);

        // store refresh token in DB(fallback)
        await RefreshToken.create({
            user: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        // Remove temp user data after successful registration
        await TempUser.deleteOne({ email });

        return { user:{ id: user._id, email: user.email } , token: accessToken };

    }

    static async login(data: loginData){

        const { email, password } = data;
        console.log('passwordddd :', password)

        const user = await User.findOne({ email });

        if(!user){
            logger.warn(`Login failed - User not found: ${email}`);
            throw new ApiError(400, 'User not found.');
        }

        //compare hashed password
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch){
            logger.warn(`Login failed - Incorrect password for user: ${email}`);
            throw new ApiError(400, 'Incorrect password.');
        }

        //Generate JWT token
        const { accessToken, refreshToken } = await generateToken(user);
        console.log( accessToken, refreshToken )

        //Store refresh token in Redis
        try {
            await setRefreshToken(user._id.toString(), refreshToken);
        } catch (error) {
            logger.error(`Failed to store refresh token in Redis: ${error}`);
        }    

        // Fallback to store in DB if Redis fails
        try {
            await RefreshToken.create({
                user: user._id, 
                token: refreshToken, 
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
        } catch (error) {
            logger.error(`Error While storing refresh Token to DB ${error}`)
        }

        // Return success response with tokens
        return { 
            user: { 
                id: user._id, 
                email: user.email 
            },
            accessToken, 
            refreshToken
         };
    }
}

export default AuthService;
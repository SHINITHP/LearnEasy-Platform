import User from "../models/User";
import { generateToken, verifyJWTToken} from "../utils/generateToken";
import { validateRegister } from "../utils/validation";
import argon2  from "argon2";
import { deleteRefreshToken, setRefreshToken } from "../../../../shared/utils/redisService";
import RefreshToken from "../models/RefreshToken";
import ApiError from '../../../../shared/utils/apiError';
import logger from "../../../../shared/utils/logger";
import { sendToQueue } from "../../../../shared/utils/rabbitmq";
import { generateOTP, storeOTP, verifyOTP } from "../../../../shared/utils/otpServices";
import TempUser from '../models/TempUser';
import jwt from 'jsonwebtoken';
import oauth2Client from "../config/googleConfig";
import axios from "axios";

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

        const otp = generateOTP();

        await sendToQueue('email_queue',{
            to: email,
            subject: "Registration OTP",
            body: `<p> Your OTP is ${otp}. </p>`,
        });

        storeOTP(email, otp);

        await TempUser.create({
            userName, 
            email, 
            password
        });

        return { email , message: "OTP sent to your email. Please verify to continue." };

    }

    static async verifyResetTokenService(token: string) {

        logger.info(`Received token: ${token}`);
    
        const user = verifyJWTToken(token);
        if (!user) {
            logger.warn("Invalid or expired token detected.");
            throw new ApiError(400, "Invalid or expired token."); 
        }

        //check the token exist in the DB
        const isTokenExist = await User.findOne({ resetToken: token });
        if(!isTokenExist){
            logger.warn("Token not exist in DB  or expired token detected.");
            throw new ApiError(400, "Invalid or expired token."); 
        }

        const decodedToken = jwt.decode(token) as jwt.JwtPayload;

        let expirationTime;
        if (decodedToken && decodedToken.exp) {
            expirationTime = new Date(decodedToken.exp * 1000); 
        }
        

        logger.info(`Token successfully verified for user: ${JSON.stringify(user)}`);

        return { user, expirationTime };
    }
    

    static async verifyOTPAndRegisterService(otp: string, email: string){
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
        const { accessToken, refreshToken } = await generateToken({ userId: user._id.toString(), email: user.email });

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

        return { user:{ userId: user._id, email: user.email } , token: accessToken, refreshToken };

    }

    static async sendResetEmail(email: string){

        //check if the user already exists!
        const isUserExist = await User.findOne({ email });
        if(!isUserExist) throw new ApiError(400, 'Email not exists.');

        const token = jwt.sign({ userId: isUserExist._id, email: isUserExist.email  }, process.env.JWT_SECRET as string, { expiresIn: "30m" })

        //store resetTOken in DB
        isUserExist.resetToken = token;
        await isUserExist.save();

        await sendToQueue('email_queue',{
            to: email,
            subject: "Password-Reset Link",
            body: `<p>Click <a href="http://localhost:5173/login?id=${isUserExist._id}&token=${token}&mode=reset-password">here</a> to reset your password.</p>`,
        });
        

        return { user: { userId: isUserExist._id, email: isUserExist.email }  };

    }

    static async resetPasswordService(token: string, newPassword: string){
        try {

            const user = verifyJWTToken(token);
            if(!user) throw new ApiError(400, "Invalid or expired token."); 

            const isUserExist = await User.findOne({ email: user.email });
            if(!isUserExist) throw new ApiError(400, 'User not Exist');

            isUserExist.password = newPassword;
            isUserExist.resetToken ="";
            await isUserExist.save();

            return 'Password reset successful.';

        } catch (error: any) {
            throw new ApiError(error.status || 500, error.message || "Internal server error.");
        }
    }

    static async logoutUser(userId: string){
        try {
            if(!userId){
                throw new ApiError(400, "User ID is required for logout.");
            }

            // Remove refresh token from Redis
            await deleteRefreshToken(userId);

            await RefreshToken.deleteOne({ user: userId });

            logger.info(`User ${userId} logged out successfully.`);
            return { message: "Logout successful" };
        } catch (error: any) {
            logger.error(`Login error: ${error.message}`);
            throw new ApiError(403, "User ID is required for logout.");
        }
    }

    static async refreshToken(refreshToken: string) {
        try {
            if (!refreshToken) {
                throw new ApiError(403, "No refresh token provided.");
            }
    
            const decoded = jwt.decode(refreshToken) as jwt.JwtPayload | null;

            if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
                throw new ApiError(403, "Refresh token expired.");
            }            
    
            const user = verifyJWTToken(refreshToken);
            logger.info(`user :: ${user}`);
            if (!user) {
                throw new ApiError(403, "Invalid refresh token.");
            }
    
            const { accessToken } = await generateToken({ userId: user.userId, email: user.email });
    
            logger.info(`New access token generated for user: ${user.userId}`);
    
            return { token: accessToken, user };
        } catch (error: any) {
            logger.error(`Refresh token error: ${error.message}`);
            throw new ApiError(403, "Invalid or expired refresh token.");
        }
    }

    static async googleAuthUser(code: any){
        try {

            const googleRes = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(googleRes.tokens)

            const userRes = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
            );

            const { email, name, picture } = userRes.data;


            let user = await User.findOne({ email });

            if(!user){
                user = await User.create({
                    userName: name,
                    email: email,
                    avatar: picture,
                  });
            }

            const { accessToken, refreshToken } = await generateToken({ userId: user._id.toString(), email: user.email })

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
                    userId: user._id, 
                    email: user.email 
                },
                accessToken, 
                refreshToken
             };

        } catch (error: any) {
            logger.error(`Google Auth Error: ${error}`)
            throw new ApiError(500, 'Internal Server Error')
        }
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
        const { accessToken, refreshToken } = await generateToken({ userId: user._id.toString(), email: user.email });

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
                userId: user._id, 
                email: user.email 
            },
            accessToken, 
            refreshToken
         };
    }
}

export default AuthService;
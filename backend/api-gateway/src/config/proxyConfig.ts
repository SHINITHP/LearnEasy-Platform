import dotenv from 'dotenv';
dotenv.config();

const services = {
    authService: process.env.AUTH_SERVICE_URL ?? "http://localhost:3001/auth",
    otpService: process.env.OTP_SERVICE_URL ?? "http://localhost:3002/otp"
}

export default services;
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../backend/.env') });

import nodemailer from 'nodemailer';
import logger from './logger';
import { generateOTP } from './otpServices';
import { storeOTP } from './otpServices';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL ,
        pass: process.env.AUTH_PASS
    }
});

const otp = generateOTP();

export const sendEmail = async (to: string, subject: string, text: string) => {
    logger.info(`Email-service reached`)
    const mailOptions = {
        from: "hexashop49@gmail.com",
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${to}`);
    } catch (error: any) {
        logger.error(`Error sending email to ${to}: ${error.message}`);
        throw new Error("Email sending failed.");
    }
}
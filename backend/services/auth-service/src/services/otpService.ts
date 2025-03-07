import { getOtp, setOtp, deleteOtp } from "../../../../shared/utils/redisService";
import crypto from "crypto";
import { sendEmail } from '../../../../shared/utils/emailService'
// import { consumeOTPMessage } from "../../../../shared/utils/rabbitmq";
import logger from "../../../../shared/utils/logger";

const OTP_EXPIRY = 300; // 5 minutes

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOTP = async (email: string, otp: string) => {
    const encryptedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  await setOtp(`otp:${email}`, encryptedOTP, OTP_EXPIRY);
};

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    const encryptedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    const storedOTP = await getOtp(`otp:${email}`);
    if (storedOTP === encryptedOTP){
        await deleteOtp(`otp:${email}`);
        return true;
    } 
    return false;
};

// Process OTP requests from RabbitMQ queue
// consumeOTPMessage(async (email: string) => {
//     logger.info(`OTP sent to ${email}`);
//     const otp = generateOTP();
//     await storeOTP(email, otp);
//     await sendEmail(email, "Code", `Your OTP is: ${otp}`)
//     logger.info(`OTP sent to ${email}`);
// })

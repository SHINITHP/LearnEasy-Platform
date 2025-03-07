import logger from "./logger";
import { getOtp, setOtp, deleteOtp } from "./redisService";
import crypto from "crypto";

const OTP_EXPIRY = 300; // 5 minutes

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOTP = async (email: string, otp: string) => {
    try {
        const encryptedOTP = crypto.createHash('sha256').update(otp.trim()).digest('hex');
        const otpKey = `otp:${email}`;

        await setOtp(otpKey, encryptedOTP, OTP_EXPIRY);

        // Small delay to ensure OTP is saved before retrieval
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log(`✅ Stored OTP for ${email}: ${encryptedOTP}`);
    } catch (error) {
        console.error(`❌ Error storing OTP: ${error}`);
        throw error;
    }
};

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
        const encryptedOTP = crypto.createHash('sha256').update(otp.trim()).digest('hex');
        const otpKey = `otp:${email}`;
        const storedOTP = await getOtp(otpKey);

        console.log(`🔍 Verifying OTP for ${email}`);
        console.log(`➡️ Entered OTP: ${encryptedOTP}`);
        console.log(`🗄️ Stored OTP: ${storedOTP}`);

        if (!storedOTP) {
            console.warn(`⚠️ OTP expired or not found for ${email}`);
            return false;
        }

        if (storedOTP === encryptedOTP) {
            await deleteOtp(otpKey);
            console.log(`✅ OTP verified and deleted for ${email}`);
            return true;
        }

        console.warn(`❌ OTP mismatch for ${email}`);
        return false;
    } catch (error) {
        console.error(`❌ Error verifying OTP: ${error}`);
        return false;
    }
};


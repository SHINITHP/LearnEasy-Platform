import { sendEmail } from '../../../../shared/utils/emailService';
import { consumeQueue } from '../../../../shared/utils/rabbitmq';
import { generateOTP, storeOTP } from '../../../../shared/utils/otpServices';

const processOtpMessage = async (message: { email: string }) => {
    const { email } = message;
    const otp = generateOTP();

    await sendEmail(email, "Code", `Your OTP is: ${otp}.`);
    storeOTP(email,otp);
}

export const consumeOTP = async () => {
    try {
        await consumeQueue('OtpQueue',processOtpMessage)
    } catch (error) {
        console.error("Error in OTP Consumer:", error);
    }
}

  
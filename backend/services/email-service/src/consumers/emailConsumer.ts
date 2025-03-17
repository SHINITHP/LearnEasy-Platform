import { sendEmail } from '../../../../shared/utils/emailService';
import { consumeQueue } from '../../../../shared/utils/rabbitmq';
import { generateOTP, storeOTP } from '../../../../shared/utils/otpServices';
import logger from '../../../../shared/utils/logger';


const ProcessEmail = async (message: any) => {
    try {
        logger.info(`Email request received`);

        const { to, subject, body } = message;

        await sendEmail(to, subject, body);
        
    } catch (error) {
        console.error("Error processing OTP message:", error);
    }
};


export const consumeEmail = async () => {
    try {

        await consumeQueue('email_queue', ProcessEmail);
    } catch (error) {
        console.error("Error in OTP Consumer:", error);
    }
}


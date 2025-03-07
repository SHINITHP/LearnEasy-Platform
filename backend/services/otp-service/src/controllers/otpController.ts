import { Request, Response } from "express";
import { sendEmail } from "../../../../shared/utils/emailService";
import { generateOTP, storeOTP } from "../../../../shared/utils/otpServices";

export const requestOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const otp = generateOTP();
        
        await sendEmail(email, "Code", `Your OTP is: ${otp}.`);
        storeOTP(email,otp);

        res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP" });
    }
}
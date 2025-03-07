import express from 'express';
import { requestOTP } from '../controllers/otpController';
const router = express.Router();

router.post('/send-otp', requestOTP);

export default router;
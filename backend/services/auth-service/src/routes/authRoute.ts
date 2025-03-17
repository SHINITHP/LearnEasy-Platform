import { Router } from 'express';
const router = Router();
import { registerUser, LoginUser, verfifyOTPAndRegister, resetPassword, refreshToken, verifyResetToken, googleAuth, forgotPassword, logout } from '../controllers/authController';

//Auth-Route
router.post('/register', registerUser);
router.post('/verifyOtp-register', verfifyOTPAndRegister )
router.post('/login', LoginUser);
router.post('/refreshToken', refreshToken);
router.get('/google', googleAuth);
router.post('/forgot-Password', forgotPassword);
router.get('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword)
router.post('/logout', logout);

export default router;
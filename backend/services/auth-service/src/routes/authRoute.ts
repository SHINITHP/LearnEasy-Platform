import { Router } from 'express';
const router = Router();
import { registerUser, LoginUser, verfifyOTP } from '../controllers/authController';

//Auth-Route
router.post('/register', registerUser);
router.post('/verify-otp', verfifyOTP )
router.post('/login', LoginUser);


export default router;
import { Router } from  'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import services from '../config/proxyConfig';

const router = Router();

router.use("/api/auth", createProxyMiddleware({
    target: services.authService, // Calls http://localhost:3001/auth
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" }, // Removes `/api/auth` prefix
}))
router.use("/api/otp", createProxyMiddleware({
    target: services.authService, // Calls http://localhost:3001/auth
    changeOrigin: true,
    pathRewrite: { "^/api/otp": "" }, // Removes `/api/auth` prefix
}))


export default router;
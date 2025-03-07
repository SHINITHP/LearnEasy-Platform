import { Response } from "express";


class ApiResponse {
    static success(res: Response, message: string, data: any = {}, statusCode: number = 200){
        return res.status(statusCode).json({ success: true, message, data });
    }

    static error(res: Response, message: string, statusCode: number = 500){
        return res.status(statusCode).json({ success: false, message });
    }
}

export default ApiResponse;
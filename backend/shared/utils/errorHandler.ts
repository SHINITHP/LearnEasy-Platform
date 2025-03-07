import { Request, Response, NextFunction } from "express";
import ApiResponse from "./apiResponse";
import ApiError from "./apiError";
import logger from "./logger";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof ApiError){
        return ApiResponse.error(res, err.message, err.statusCode);
    }

    console.log('Unhandled error: ', err);
    return ApiResponse.error(res, 'Something went wrong!', 500);
};

export default errorHandler;
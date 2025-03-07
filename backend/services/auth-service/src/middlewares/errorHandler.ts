import { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import logger from "../../../../shared/utils/logger";


// const errorHandler = (err, req, res, next) => {
//     //log the error
//     logger.error(err.stack);

//     //set status code as default once if not provided
//     const statusCode = err.status || 500;

//     console.log(err)
//     //Send JSON response 
//     res.status(statusCode).json({
//         success: false,
//         message: err.message || 'Internal Server Error',
//         ...(process.env.NODE_ENV !== 'production' && { stack: err.stack})// Show stack trace only in development
//     })
// }

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack || err.message); // Log stack or message if no stack

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }), // Conditional stack trace
    });

}

export default errorHandler;
import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandlerClass";

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err.error || {}
  })
};

export default errorHandler;
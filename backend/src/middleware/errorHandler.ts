import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { config } from '../config';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Handle Mongoose duplicate key error
  if ((err as { code?: number }).code === 11000) {
    const field = Object.keys((err as { keyPattern?: Record<string, number> }).keyPattern || {})[0] || 'field';
    sendError(res, `A record with this ${field} already exists.`, 409);
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const mongooseErr = err as unknown as { errors: Record<string, { message: string }> };
    const messages = Object.values(mongooseErr.errors).map((e) => e.message);
    sendError(res, messages.join(', '), 400);
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid authentication token', 401);
    return;
  }
  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Authentication token expired', 401);
    return;
  }

  // Log unexpected errors internally, never leak stack trace to clients
  console.error('💥 Unhandled Exception:', err);
  const message = config.env === 'production' ? 'Internal server error' : err.message;
  sendError(res, message, 500);
};

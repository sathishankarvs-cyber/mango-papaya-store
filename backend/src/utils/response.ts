import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: unknown;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200,
  meta?: ApiResponse['meta']
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message = 'An error occurred',
  statusCode = 500,
  error?: unknown
): Response => {
  const payload: ApiResponse = {
    success: false,
    message,
    error,
  };
  return res.status(statusCode).json(payload);
};

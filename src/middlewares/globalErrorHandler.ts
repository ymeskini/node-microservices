import { STATUS_CODES } from 'http';
import config from 'config';

import type { ErrorRequestHandler, Response } from 'express';
import { AppError } from '../utils/AppError';

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      error: STATUS_CODES[err.statusCode],
    });
  } else {
    // don't leak the error to the client
    console.error('ERROR 🚨', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

// don't remove _next in parameters otherwise the middleware won't work
export const globalErrorHandler: ErrorRequestHandler = (err, _, res, _next) => {
  err.statusCode = err.statusCode || 500;

  if (config.get<boolean>('DEBUG')) {
    sendErrorDev(err, res);
  } else {
    const error = { ...err };

    sendErrorProd(error, res);
  }
};

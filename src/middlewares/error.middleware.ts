import { STATUS_CODES } from 'http';
import config from 'config';
import Joi from 'joi';

import type { ErrorRequestHandler, Response } from 'express';
import { AppError } from '../utils/AppError';

const sendErrorDev = (err: AppError, res: Response) => {
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
      statusCode: 500,
      message: STATUS_CODES[500],
    });
  }
};

const handleAuth0TokenError = () => new AppError('Unauthorized', 401);
const handleJoiError = () => new AppError('Bad Request', 400);

// don't remove _next in parameters otherwise the middleware won't work
export const globalErrorHandler: ErrorRequestHandler = (err, _, res, _next) => {
  err.statusCode = err.statusCode || 500;

  if (config.get('DEBUG')) {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };

    if (err.name === 'UnauthorizedError') {
      error = handleAuth0TokenError();
    }

    if (Joi.isError(err)) {
      error = handleJoiError();
    }

    sendErrorProd(error, res);
  }
};

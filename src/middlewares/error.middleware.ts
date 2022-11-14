import type { ErrorRequestHandler } from 'express';
import { STATUS_CODES } from 'http';
import Joi from 'joi';
import { Logger } from 'winston';

import { AppError } from '../utils/AppError';

const handleAuth0TokenError = () => new AppError('Unauthorized', 401);
const handleJoiError = () => new AppError('Bad Request', 400);

// don't remove _next in parameters otherwise the middleware won't work
export const globalErrorHandler =
  (logger: Logger): ErrorRequestHandler =>
  (err, _, res, _next) => {
    err.statusCode = err.statusCode || 500;
    let error = { ...err };

    logger.error(err);

    if (err.name === 'UnauthorizedError') {
      error = handleAuth0TokenError();
    }

    if (Joi.isError(err)) {
      error = handleJoiError();
    }

    if (error.isOperational) {
      res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: STATUS_CODES[error.statusCode],
      });
    } else {
      // don't leak the error to the client
      res.status(500).json({
        statusCode: 500,
        message: STATUS_CODES[500],
      });
    }
  };

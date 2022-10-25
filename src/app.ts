import express from 'express';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { AppError } from './utils/AppError';

export const app = express();

app
  .disable('x-powered-by')
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(morgan('dev'))
  .all('*', (_req, _res, next) => {
    next(new AppError('Not Found', 404));
  })
  .use(globalErrorHandler);

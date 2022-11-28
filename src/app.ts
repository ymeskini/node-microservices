import express, { Router } from 'express';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from 'config';
import { Logger } from 'winston';

import { globalErrorHandler } from './middlewares/error.middleware';
import { userRouter } from './users/users.routes';
import { AppError } from './utils/AppError';
import { authRouter } from './auth/auth.routes';
import { oicdMiddleware } from './middlewares/auth.middleware';
import { analyticsRouter } from './analytics/analytics.router';

export const initApp = (logger: Logger) => {
  const app = express();
  const v1Router = Router();

  v1Router
    .use('/users', userRouter)
    .use('/auth', authRouter)
    .use('/analytics', analyticsRouter);

  app
    .disable('x-powered-by')
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(
      morgan('tiny', {
        stream: { write: (message) => logger.info(message.trim()) },
      }),
    )
    .use(
      '/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(config.get('swagger'))),
    )
    .use(oicdMiddleware)
    .use('/api/v1', v1Router)
    .all('*', (_req, _res, next) => {
      next(new AppError('Not Found', 404));
    })
    .use(globalErrorHandler(logger));

  return app;
};

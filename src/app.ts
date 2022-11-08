import express, { Router } from 'express';
import morgan from 'morgan';
import { auth } from 'express-openid-connect';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from 'config';

import { globalErrorHandler } from './middlewares/error.middleware';
import { userRouter } from './users/users.routes';
import { AppError } from './utils/AppError';
import { Logger } from 'winston';

export const initApp = (logger: Logger) => {
  const app = express();
  const v1Router = Router();

  v1Router.use('/users', userRouter);

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
    .use(auth(config.get('auth0')))
    .use('/api/v1', v1Router)
    .all('*', (_req, _res, next) => {
      next(new AppError('Not Found', 404));
    })
    .use(globalErrorHandler);

  return { app, port: config.get<number>('server.port') };
};

import express from 'express';
import morgan from 'morgan';
import { auth } from 'express-openid-connect';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from 'config';

import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { userRouter } from './users/users.routes';
import { AppError } from './utils/AppError';
import { Logger } from 'winston';

export const initApp = (logger: Logger) => {
  const app = express();

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
    .use('/api/v1/users', userRouter)
    .all('*', (_req, _res, next) => {
      next(new AppError('Not Found', 404));
    })
    .use(globalErrorHandler);

  return { app, port: config.get('server.port') };
};

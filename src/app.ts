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
import { authRouter } from './auth/auth.routes';
import { jwtCheck } from './auth/auth.middleware';

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
    .use('/api/v1/auth', authRouter)
    .use('/api/v1/users', userRouter)
    .get('/profile', jwtCheck, (req, res) => {
      res.json({
        user: req.oidc.user,
        access_token: req.oidc.accessToken?.access_token,
        id_token: req.oidc.idToken,
      });
    })
    .all('*', (_req, _res, next) => {
      next(new AppError('Not Found', 404));
    })
    .use(globalErrorHandler);

  return { app, port: config.get('server.port') };
};

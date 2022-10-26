import express from 'express';
import morgan from 'morgan';
import { auth } from 'express-openid-connect';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { userRouter } from './users/users.routes';
import { AppError } from './utils/AppError';

export const app = express();

app
  .disable('x-powered-by')
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(morgan('dev'))
  .use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(
      swaggerJSDoc({
        definition: {
          basePath: '/api/v1',
          info: {
            title: 'Users API',
            version: '1.0.0',
          },
        },
        apis: [__dirname + '/**/*.routes.ts'],
      }),
    ),
  )
  .use(
    auth({
      authRequired: false,
      auth0Logout: true,
      secret: process.env['AUTH0_SECRET'],
      baseURL: 'http://localhost:5555',
      clientID: process.env['AUTH0_CLIENT_ID'],
      issuerBaseURL: 'https://dev-mpaylzhdhvqrio10.us.auth0.com',
    }),
  )
  .use('/api/v1/users', userRouter)
  .all('*', (_req, _res, next) => {
    next(new AppError('Not Found', 404));
  })
  .use(globalErrorHandler);

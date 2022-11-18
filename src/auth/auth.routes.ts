import { Router } from 'express';
import { requiresAuth } from 'express-openid-connect';
import { jwtCheck } from '../middlewares/auth.middleware';
import { User } from '../users/users.model';
import { catchAsync } from '../utils/catchAsync';

import { AuthController } from './auth.controller';

export const authRouter = Router();
const authController = new AuthController(User);

authRouter.route('/login').get(authController.login);
authRouter.route('/token').get(requiresAuth(), authController.getToken);

authRouter.use(jwtCheck);
authRouter.route('/logout').get(authController.logout);
authRouter
  .route('/resetPassword')
  .post(catchAsync(authController.resetPassword));
authRouter.route('/changeEmail').post(catchAsync(authController.changeMail));

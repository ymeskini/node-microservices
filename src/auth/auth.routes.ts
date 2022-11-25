import { Router } from 'express';
import { requiresAuth } from 'express-openid-connect';

import { AuthController } from './auth.controller';

export const authRouter = Router();
const authController = new AuthController();

authRouter.route('/logout').get(authController.logout);
authRouter.route('/login').get(authController.login);
authRouter.route('/token').get(requiresAuth(), authController.getToken);

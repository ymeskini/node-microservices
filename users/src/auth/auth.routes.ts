import { Router } from 'express';
import { requiresAuth } from 'express-openid-connect';

import { AuthController } from './auth.controller';

export const authRouter = Router();
const authController = new AuthController();

/**
 * @openapi
 * /api/v1/auth/logout:
 *   get:
 *     tags:
 *       - auth
 *     responses:
 *       302:
 *         description: Redirects to /
 */
authRouter.route('/logout').get(authController.logout);
/**
 * @openapi
 * /api/v1/auth/login:
 *   get:
 *     tags:
 *       - auth
 *     responses:
 *       302:
 *         description: Redirects to Auth0 Login Page
 */
authRouter.route('/login').get(authController.login);
/**
 * @openapi
 * /api/v1/auth/token:
 *   get:
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: Sends idToken and accessToken
 *       302:
 *         description: Redirects to Auth0 Login Page
 */
authRouter.route('/token').get(requiresAuth(), authController.getToken);

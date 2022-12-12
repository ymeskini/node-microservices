import { Router } from 'express';
import { requiresAuth } from 'express-openid-connect';

import { AuthController } from './auth.controller';

export const authRouter = Router();
const authController = new AuthController();

/**
 * @openapi
 * /api/v1/auth/logout:
 *   get:
 *     summary: Logs out the user
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
 *     summary: Logs in the user (in auth0 UI) and redirects to /api/v1/auth/token
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
 *     summary: Returns idToken and accessToken
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: Sends idToken and accessToken
 *       302:
 *         description: Redirects to Auth0 Login Page
 */
authRouter.route('/token').get(requiresAuth(), authController.getToken);

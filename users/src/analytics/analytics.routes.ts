import { Router } from 'express';
import Joi from 'joi';

import { jwtCheck } from '../middlewares/auth.middleware';
import { checkAuthz } from '../middlewares/authz.middleware';
import { validate } from '../middlewares/validate.middleware';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

export const analyticsRouter = Router();
const analyticsService = new AnalyticsService();
const analyticsController = new AnalyticsController(analyticsService);

analyticsRouter.use(jwtCheck(true));

/**
 * @openapi
 * /api/v1/analytics:
 *   get:
 *     tags:
 *       - analytics
 *     responses:
 *       200:
 *         description: Successfully returns analytics of a user
 *       401:
 *         description: The token is absent/invalid/expired
 *       403:
 *         description: You're not allowed to access this resource
 */
analyticsRouter.get(
  '/',
  checkAuthz('read:users'),
  validate(
    Joi.object({
      body: Joi.object({
        userId: Joi.string().required(),
      }).required(),
    }),
  ),
  analyticsController.getLogs,
);

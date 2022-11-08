import { Router } from 'express';

// import { jwtCheck } from '../middlewares/auth.middleware';
import { checkPermissions } from '../middlewares/permission.middleware';
import { userMiddleware } from '../middlewares/user.middleware';
import { catchAsync } from '../utils/catchAsync';
import { UserController } from './users.controller';
import { User } from './users.model';

export const userRouter = Router();
const userController = new UserController(User);

// userRouter.use(jwtCheck);

/**
 * @openapi
 * /users:
 *   get:
 *     description: Endpoint to retrieve users
 *     responses:
 *       200:
 *         description: Returns the list of users.
 */
userRouter
  .route('/')
  .get(checkPermissions('read:users'), catchAsync(userController.listUsers));

/**
 * @openapi
 * /profile:
 *   get:
 *     description: Endpoint to current user profile
 *     responses:
 *       200:
 *         description: Returns user profile.
 */
userRouter
  .route('/profile')
  .get(userMiddleware, catchAsync(userController.profile));

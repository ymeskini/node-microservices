import { Router } from 'express';

import { jwtCheck } from '../middlewares/auth.middleware';
import { checkPermissions } from '../middlewares/permission.middleware';
import { catchAsync } from '../utils/catchAsync';
import { UserController } from './users.controller';
import { User } from './users.model';

export const userRouter = Router();
const userController = new UserController(User);

userRouter.use(jwtCheck);

/**
 * @openapi
 * /users/profile:
 *   get:
 *     description: Endpoint to current user profile
 *     responses:
 *       200:
 *         description: Returns user profile.
 */
userRouter.route('/me').get(catchAsync(userController.profile));

/**
 * @openapi
 * /users:
 *   get:
 *     description: Endpoint to retrieve users
 *     responses:
 *       200:
 *         description: Returns the list of users.
 *       401:
 *         description: Token is not correct
 *       403:
 *         description: Insufficient persmissions
 *   post:
 *     description: Endpoint to retrieve users
 *     responses:
 *       201:
 *         description: Returns the list of users.
 *   delete:
 *     description: Endpoint to retrieve users
 *     responses:
 *       201:
 *         description: Returns the list of users.
 *   patch:
 *     description: Endpoint to retrieve users
 *     responses:
 *       201:
 *         description: Returns the list of users.
 */
userRouter
  .route('/')
  .post(
    checkPermissions(['create:users']),
    catchAsync(userController.createUser),
  )
  .delete(
    checkPermissions(['delete:users']),
    catchAsync(userController.deleteUser),
  )
  .patch(
    checkPermissions(['update:users']),
    catchAsync(userController.updateUser),
  )
  .get(checkPermissions(['read:users']), catchAsync(userController.listUsers));

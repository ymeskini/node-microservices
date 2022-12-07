import { Router } from 'express';

import { isAdmin } from '../middlewares/admin.middleware';
import { jwtCheck } from '../middlewares/auth.middleware';
import { checkAuthz } from '../middlewares/authz.middleware';
import { catchAsync } from '../utils/catchAsync';
import { UserController } from './users.controller';
import {
  validAdminCreateUserBody,
  validAdminPatchUserBody,
  validAdminPutUserBody,
  validCreateUserBody,
  validPatchUserBody,
  validPutUserBody,
} from './users.schemas';
import { UserService } from './users.service';

export const userRouter = Router();

const userController = new UserController(new UserService());

/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: Successfully creates a user
 */
userRouter.route('/').post(
  jwtCheck(false),
  isAdmin,
  catchAsync(async (req, _res, next) => {
    if (req.isAdmin) {
      await validAdminCreateUserBody.validateAsync(req.body);
      return next();
    }
    await validCreateUserBody.validateAsync(req.body);
    next();
  }),
  catchAsync(userController.createUser),
);

userRouter.use(jwtCheck(true));

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: Successfully returns the list of users
 *       401:
 *         description: The token is absent/invalid/expired
 *       403:
 *         description: You're not allowed to access this resource
 */
userRouter.get(
  '/',
  checkAuthz('read:users'),
  catchAsync(userController.listUsers),
);

/**
 * @openapi
 * /api/v1/users/{:userId}:
 *   get:
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: Successfully return the user
 *       404:
 *         description: User not found
 *       401:
 *         description: The token is absent/invalid/expired
 *       403:
 *         description: You're not allowed to access this resource
 */
userRouter.get('/:id', isAdmin, catchAsync(userController.getUser));

/**
 * @openapi
 * /api/v1/users/{:userId}:
 *   delete:
 *     tags:
 *       - users
 *     responses:
 *       204:
 *         description: Successfully deleted the user
 *       404:
 *         description: User not found
 *       401:
 *         description: The token is absent/invalid/expired
 *       403:
 *         description: You're not allowed to access this resource
 */
userRouter.delete('/:id', isAdmin, catchAsync(userController.deleteUser));

/**
 * @openapi
 * /api/v1/users/{:userId}:
 *   put:
 *     tags:
 *       - users
 *     responses:
 *       204:
 *         description: Successfully deleted the user
 *       404:
 *         description: User not found
 *       401:
 *         description: The token is absent/invalid/expired
 *       400:
 *         description: Bad request, the body is not valid
 *       403:
 *         description: You're not allowed to access this resource
 */
userRouter.put(
  '/:id',
  isAdmin,
  catchAsync(async (req, _res, next) => {
    if (req.isAdmin) {
      await validAdminPutUserBody.validateAsync(req.body);
      return next();
    }
    await validPutUserBody.validateAsync(req.body);
    next();
  }),
  catchAsync(userController.putUser),
);

/**
 * @openapi
 * /api/v1/users/{userId}:
 *   patch:
 *     tags:
 *       - users
 *     summary: Partially updates a user
 *     description: update a user
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully updated the user
 *       404:
 *         description: User not found
 *       401:
 *         description: The token is absent/invalid/expired
 *       400:
 *         description: Bad request, the body is not valid
 *       403:
 *         description: You're not allowed to access this resource
 */
userRouter.patch(
  '/:id',
  isAdmin,
  catchAsync(async (req, _res, next) => {
    if (req.isAdmin) {
      await validAdminPatchUserBody.validateAsync(req.body);
      return next();
    }
    await validPatchUserBody.validateAsync(req.body);
    next();
  }),
  catchAsync(userController.patchUser),
);

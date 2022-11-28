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

userRouter.get(
  '/',
  checkAuthz('read:users'),
  catchAsync(userController.listUsers),
);

userRouter.get('/:id', isAdmin, catchAsync(userController.getUser));

userRouter.delete('/:id', isAdmin, catchAsync(userController.deleteUser));

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

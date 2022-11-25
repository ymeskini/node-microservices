import { Router } from 'express';
import Joi from 'joi';
import { isAdmin } from '../middlewares/admin.middleware';

import { jwtCheck } from '../middlewares/auth.middleware';
import { checkPermissions } from '../middlewares/permission.middleware';
import { validate } from '../middlewares/validate.middleware';
import { catchAsync } from '../utils/catchAsync';
import { UserController } from './users.controller';
import {
  // adminUpdateUserPayload,
  validCreateUserBody,
  // validIdParamsMongoId,
} from './users.schemas';
import { UserService } from './users.service';

const userService = new UserService();
export const userRouter = Router();
const userController = new UserController(userService);

userRouter.route('/').post(
  jwtCheck(false),
  isAdmin,
  validate(
    Joi.object({
      body: validCreateUserBody.required(),
    }),
  ),
  catchAsync(userController.createUser),
);

userRouter.use(jwtCheck(true));

userRouter.get(
  '/',
  checkPermissions(['read:users']),
  catchAsync(userController.listUsers),
);

userRouter.get('/:id', catchAsync(userController.getUser));

// userRouter
//   .route('/:id')
//   .all(
//     validate(
//       Joi.object({
//         params: validIdParamsMongoId.required(),
//       }),
//     ),
//   )
//   .get(checkPermissions(['read:users']), catchAsync(userController.getUser))
//   .delete(
//     checkPermissions(['delete:users']),
//     catchAsync(userController.deleteUser),
//   )
//   .patch(
//     checkPermissions(['update:users']),
//     validate(
//       Joi.object({
//         body: adminUpdateUserPayload.required().keys().min(1).required(),
//       }),
//     ),
//     catchAsync(userController.updateUser),
//   );

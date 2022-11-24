import { Router } from 'express';
import Joi from 'joi';

import { jwtCheck } from '../middlewares/auth.middleware';
import { checkPermissions } from '../middlewares/permission.middleware';
import { validate } from '../middlewares/validate.middleware';
import { catchAsync } from '../utils/catchAsync';
import { UserController } from './users.controller';
import { User } from './users.model';
import {
  adminUpdateUserPayload,
  validCreateUserBody,
  validIdParamsMongoId,
} from './users.schemas';

export const userRouter = Router();
const userController = new UserController(User);

userRouter.route('/').post(
  validate(
    Joi.object({
      body: validCreateUserBody.required(),
    }),
  ),
  catchAsync(userController.createUser),
);

userRouter.use(jwtCheck);

userRouter
  .route('/')
  .get(checkPermissions(['read:users']), catchAsync(userController.listUsers));

userRouter
  .route('/:id')
  .all(
    validate(
      Joi.object({
        params: validIdParamsMongoId.required(),
      }),
    ),
  )
  .get(checkPermissions(['read:users']), catchAsync(userController.getUser))
  .delete(
    checkPermissions(['delete:users']),
    catchAsync(userController.deleteUser),
  )
  .patch(
    checkPermissions(['update:users']),
    validate(
      Joi.object({
        body: adminUpdateUserPayload.required().keys().min(1).required(),
      }),
    ),
    catchAsync(userController.updateUser),
  );

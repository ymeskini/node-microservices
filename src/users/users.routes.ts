import { Router } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { UserController } from './users.controller';
import { User } from './users.model';

export const userRouter = Router();
const userController = new UserController(User);

/**
 * @openapi
 * /users:
 *   get:
 *     description: Endpoint to retrieve users
 *     responses:
 *       200:
 *         description: Returns the list of users.
 */
userRouter.route('/').get(catchAsync(userController.listUsers));

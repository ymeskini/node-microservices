import { Router } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from './users.model';

export const userRouter = Router();

userRouter.route('/').get(
  catchAsync(async (_req, res) => {
    const users = await User.find();
    res.json({ users });
  }),
);

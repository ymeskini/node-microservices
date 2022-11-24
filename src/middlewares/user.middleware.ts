import { Handler } from 'express';
import { Request } from 'express-jwt';
import { IUser, User } from '../users/users.model';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}

export const attachUserToRequest: Handler = catchAsync(
  async (req: Request, _res, next) => {
    const userId = req.auth?.sub?.split('|')[1];
    const currentUser = await User.findById(userId).select(
      '-password -tenant -client_id -connection',
    );
    if (!currentUser) {
      return next(new AppError('User does not exist', 401));
    }
    req.user = currentUser;
    next();
  },
);

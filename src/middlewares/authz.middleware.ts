import { Handler } from 'express';
import { Request } from 'express-jwt';
import { AppError } from '../utils/AppError';

export const checkAuthz =
  (scope: string): Handler =>
  (req: Request, _res, next) => {
    const { auth } = req;
    if (!auth?.['permissions'].includes(scope)) {
      return next(new AppError('Forbidden', 403));
    }
    next();
  };

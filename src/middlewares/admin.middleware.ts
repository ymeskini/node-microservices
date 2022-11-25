import { Handler } from 'express';
import { Request } from 'express-jwt';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      isAdmin?: boolean;
    }
  }
}

export const isAdmin: Handler = (req: Request, _res, next) => {
  if (req.auth) {
    req.isAdmin =
      req.auth['https://ym-toptal-users.com/roles'].includes('admin');
  }

  next();
};

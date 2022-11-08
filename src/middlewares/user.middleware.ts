/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handler } from 'express';
import { IUser, User } from '../users/users.model';

const PERMISSION_PATH = `${process.env['AUTH0_AUDIENCE']}/roles`;

declare global {
  namespace Express {
    interface Request {
      loggedUser: IUser;
    }
  }
}

export const userMiddleware: Handler = async (req, _res, next) => {
  const { oidc } = req;

  let user = await User.findOne({
    auth0Id: req.oidc.user?.['sub'],
  });

  if (!user) {
    user = await User.create({
      email: oidc.user?.['email'],
      auth0Id: oidc.user?.['sub'],
      permissionLevel: oidc.user?.[PERMISSION_PATH][0],
      status: 'active',
    });
  }

  req.loggedUser = user;

  next();
};

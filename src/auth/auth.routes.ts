import { Router } from 'express';
import { IUser } from '../users/users.model';
import { AuthController } from './auth.controller';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      loggedUser: IUser;
    }
  }
}

export const authRouter = Router();
const authController = new AuthController();

authRouter.route('/token').get(authController.getToken);

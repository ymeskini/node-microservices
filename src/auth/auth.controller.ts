import { Request, Response } from 'express';
import { UserModel } from '../users/users.model';

export class AuthController {
  userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  authCallback = async (_req: Request, res: Response) => {
    res.json({ token: '' });
  };
}

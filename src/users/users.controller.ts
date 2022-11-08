import { Request, Response } from 'express';
import { UserModel } from './users.model';

export class UserController {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  listUsers = async (_req: Request, res: Response) => {
    const users = await this.userModel.find();
    res.json({ users });
  };

  profile = async (req: Request, res: Response) => {
    const { oidc } = req;

    res.json({
      user: oidc.user,
      token: oidc.accessToken?.access_token,
    });
  };
}

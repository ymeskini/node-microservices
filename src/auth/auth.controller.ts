import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import Joi from 'joi';
import { changePasswordRequest, updateUserEmail } from '../libs/auth0';
import { UserModel } from '../users/users.model';
import { AppError } from '../utils/AppError';

const resetPasswordBodySchema = Joi.object({
  email: Joi.string().email().required(),
}).required();

export class AuthController {
  private userModel: UserModel;
  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  getToken = (req: Request, res: Response) => {
    const { oidc } = req;

    res.json({
      accessToken: oidc.accessToken?.access_token,
      idToken: oidc.idToken,
    });
  };

  login = (_req: Request, res: Response) => {
    return res.oidc.login();
  };

  logout = (_req: Request, res: Response) => {
    return res.oidc.logout();
  };

  resetPassword = async (req: Request, res: Response) => {
    await resetPasswordBodySchema.validateAsync(req.body);
    await changePasswordRequest(req.body.email);
    res.status(201).send();
  };

  changeMail = async (req: Request, res: Response, next: NextFunction) => {
    await resetPasswordBodySchema.validateAsync(req.body);
    const userExists = await this.userModel.findOne({
      email: req.body.email,
    });
    if (userExists) {
      return next(new AppError('Email already exists', 409));
    }

    await updateUserEmail(
      req.auth?.sub?.split('|')[0] as string,
      req.body.email,
      req.headers['authorization'] as string,
    );
    res.status(201).send();
  };
}

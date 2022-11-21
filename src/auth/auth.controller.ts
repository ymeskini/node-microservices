import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import Joi from 'joi';
import {
  assignRoleToUser,
  changePasswordRequest,
  createAuth0User,
  getAuth0Token,
  updateUserEmail,
} from '../libs/auth0';
import { UserModel } from '../users/users.model';
import { AppError } from '../utils/AppError';

const resetPasswordBodySchema = Joi.object({
  email: Joi.string().email().required(),
}).required();

export const signupBodySchema = Joi.object({
  email: Joi.string().email().required(),
  // should follow the password policy set in auth0
  password: Joi.string()
    .min(8)
    .regex(/[A-Z]/, 'upper-case')
    .regex(/[a-z]/, 'lower-case')
    .regex(/[0-9]/, 'number character')
    .regex(/[^\w]/, 'special character')
    .required(),
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
    res.sendStatus(200);
  };

  changeMail = async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    await resetPasswordBodySchema.validateAsync(body);

    const userExists = await this.userModel.findOne({
      email: body.email,
    });
    if (userExists) {
      return next(new AppError('Email already taken', 409));
    }

    const { data: token } = await getAuth0Token();
    await updateUserEmail(
      req.auth?.sub as string,
      body.email,
      token.access_token,
    );
    res.status(201).send();
  };

  signup = async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    await signupBodySchema.validateAsync(body);

    const userExists = await this.userModel.findOne({
      email: body.email,
    });
    if (userExists) {
      return next(new AppError('Email already exists', 409));
    }

    const { data: token } = await getAuth0Token();
    const { data } = await createAuth0User(
      {
        email: body.email,
        password: body.password,
      },
      token.access_token,
    );

    await assignRoleToUser(data.user_id, ['customer'], token.access_token);

    res.json(data);
  };
}

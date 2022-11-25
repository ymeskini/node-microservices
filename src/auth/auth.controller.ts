import { Response } from 'express';
import { Request } from 'express-jwt';
import Joi from 'joi';

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
}

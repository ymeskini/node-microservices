import { Response } from 'express';
import { Request } from 'express-jwt';

export class AuthController {
  getToken = (req: Request, res: Response) => {
    const { oidc } = req;

    res.json({
      accessToken: oidc.accessToken?.access_token,
      idToken: oidc.idToken,
    });
  };

  login = (_req: Request, res: Response) => {
    return res.oidc.login({ returnTo: '/api/v1/auth/token' });
  };

  logout = (_req: Request, res: Response) => {
    return res.oidc.logout();
  };
}

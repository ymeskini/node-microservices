import { Request, Response } from 'express';

export class AuthController {
  getToken = (req: Request, res: Response) => {
    const { oidc } = req;

    res.json({
      token: oidc.accessToken?.access_token,
    });
  };
}

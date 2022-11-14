import { expressjwt, GetVerificationKey } from 'express-jwt';
import { auth } from 'express-openid-connect';
import jwks from 'jwks-rsa';
import config from 'config';

import { User } from '../users/users.model';

const PERMISSION_PATH = `${process.env['AUTH0_AUDIENCE']}/roles`;

export const jwtCheck = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env['AUTH0_DOMAIN']}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: process.env['AUTH0_AUDIENCE'],
  issuer: `https://${process.env['AUTH0_DOMAIN']}/`,
  algorithms: ['RS256'],
});

export const oicdMiddleware = auth({
  ...config.get('auth0'),
  afterCallback: async (req, _res, session) => {
    const { oidc } = req;
    const user = await oidc.fetchUserInfo();
    const foundUser = await User.findOne({ auth0Id: user.sub });

    if (!foundUser) {
      await User.create({
        auth0Id: user.sub,
        email: user.email,
        roles: user[PERMISSION_PATH],
      });
    }

    return session;
  },
});

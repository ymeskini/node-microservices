import { expressjwt, GetVerificationKey } from 'express-jwt';
import { auth } from 'express-openid-connect';
import jwks from 'jwks-rsa';
import config from 'config';

export const jwtCheck = (requireCredentials = true) =>
  expressjwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env['AUTH0_DOMAIN']}/.well-known/jwks.json`,
    }) as GetVerificationKey,
    credentialsRequired: requireCredentials,
    audience: process.env['AUTH0_AUDIENCE'],
    issuer: `https://${process.env['AUTH0_DOMAIN']}/`,
    algorithms: ['RS256'],
  });

export const oicdMiddleware = auth({
  ...config.get('auth0'),
});

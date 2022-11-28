import config from 'config';
import { ManagementClient } from 'auth0';

export const auth0 = new ManagementClient({
  domain: process.env['AUTH0_DOMAIN'] as string,
  clientId: config.get('auth0.clientID'),
  clientSecret: config.get('auth0.clientSecret'),
  scope:
    'read:users update:users create:users create:users_app_metadata delete:users delete:users_app_metadata',
});

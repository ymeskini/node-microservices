import { ManagementClient } from 'auth0';
import type { CreateUserData } from 'auth0';
import config from 'config';

export class UserService {
  private auth0: ManagementClient;

  constructor() {
    this.auth0 = new ManagementClient({
      domain: process.env['AUTH0_DOMAIN'] as string,
      clientId: config.get('auth0.clientID'),
      clientSecret: config.get('auth0.clientSecret'),
      scope:
        'read:users update:users create:users create:users_app_metadata delete:users delete:users_app_metadata',
    });
  }

  getUsers = (limit: number, offset: number) => {
    return this.auth0.getUsers({
      per_page: limit,
      page: offset,
    });
  };

  getUser = (id: string) => {
    return this.auth0.getUser({ id });
  };

  createUser = (data: Omit<CreateUserData, 'connection'>) => {
    return this.auth0.createUser({
      ...data,
      connection: 'Username-Password-Authentication',
    });
  };
}

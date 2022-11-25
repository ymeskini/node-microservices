import { ManagementClient } from 'auth0';
import config from 'config';

import { auth0RolesIds, UserRole } from './users.model';
import { CreateUserDto, PutUserDto, PutUserMetadataDto } from './users.dto';

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

  createUser = async (
    data: CreateUserDto,
    roles: UserRole[] = ['customer'],
  ) => {
    const user = await this.auth0.createUser({
      ...data,
      connection: 'Username-Password-Authentication',
      verify_email: true,
    });

    await this.auth0.assignRolestoUser(
      { id: user.user_id as string },
      { roles: roles.map((role) => auth0RolesIds[role]) },
    );

    return user;
  };

  deleteUser = async (id: string) => {
    return this.auth0.deleteUser({ id });
  };

  putUser = async (
    id: string,
    data: PutUserDto,
    userMetadata: PutUserMetadataDto,
  ) => {
    return this.auth0.updateUser(
      { id },
      { user_metadata: userMetadata, ...data },
    );
  };
}

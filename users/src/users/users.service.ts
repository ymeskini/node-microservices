import { ManagementClient } from 'auth0';

import { auth0RolesIds, UserRole } from './users.model';
import { CreateUserDto, PutUserDto, PutUserMetadataDto } from './users.dto';
import { auth0 } from '../libs/auth0';

export class UserService {
  private auth0: ManagementClient;

  constructor() {
    this.auth0 = auth0;
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
    roles?: UserRole[],
  ) => {
    if (roles) {
      const currentUserRoles = await this.auth0.getUserRoles({ id });
      const currentUserRoleNames = currentUserRoles.map((r) => r.name);
      const rolesToRemoveFromUser = currentUserRoleNames.filter((role) => {
        return !roles.includes(role as UserRole);
      }) as string[];

      const rolesToAssignToUser = roles.filter((role) => {
        return !currentUserRoleNames.includes(role as UserRole);
      }) as string[];

      if (rolesToRemoveFromUser.length > 0) {
        this.auth0.removeRolesFromUser(
          { id },
          {
            roles: rolesToRemoveFromUser.map(
              (role) => auth0RolesIds[role as UserRole],
            ),
          },
        );
      }

      if (rolesToAssignToUser.length > 0) {
        await this.auth0.assignRolestoUser(
          { id },
          {
            roles: rolesToAssignToUser.map(
              (role) => auth0RolesIds[role as UserRole],
            ),
          },
        );
      }
    }
    return this.auth0.updateUser(
      { id },
      { user_metadata: userMetadata, ...data },
    );
  };
}

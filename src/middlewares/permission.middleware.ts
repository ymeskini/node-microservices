import jwtAuthz from 'express-jwt-authz';

type UserPermission =
  | 'create:users'
  | 'update:users'
  | 'delete:users'
  | 'read:users';

export const checkPermissions = (permissions: UserPermission[]) =>
  jwtAuthz(permissions, {
    customScopeKey: 'permissions',
    customUserKey: 'auth',
    checkAllScopes: true,
    failWithError: true,
  });

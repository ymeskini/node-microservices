import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Permission } from './user.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.get<Permission[]>(
      'permissions',
      context.getHandler(),
    );
    const user = context.getArgs()[2].req.user;
    const userPermissions = user.permissions;

    if (!routePermissions) {
      return true;
    }

    const hasPermission = () =>
      routePermissions.every((routePermission) =>
        userPermissions.includes(routePermission),
      );

    return hasPermission();
  }
}

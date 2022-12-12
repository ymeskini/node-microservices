import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { User, UserRole } from './user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routeRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    const user = context.getArgs()[2].req.user as User;
    const userRoles = user['https://ym-toptal-users.com/roles'];

    if (!routeRoles) {
      return true;
    }

    const hasPermission = () =>
      routeRoles.every((routePermission) =>
        userRoles.includes(routePermission),
      );

    return hasPermission();
  }
}

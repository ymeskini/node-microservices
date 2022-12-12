import { SetMetadata } from '@nestjs/common';
import { UserRole } from './user.decorator';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

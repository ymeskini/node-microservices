import { SetMetadata } from '@nestjs/common';
import { Permission } from './user.decorator';

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);

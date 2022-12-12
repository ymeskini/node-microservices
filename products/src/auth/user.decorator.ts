import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

type Actions = 'create' | 'read' | 'update' | 'delete';
type Resource = 'products' | 'users';
export type Permission = `${Actions}:${Resource}`;
export type UserRole = 'admin' | 'user' | 'supplier';

export interface User {
  'https://ym-toptal-users.com/roles': UserRole[];
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  permissions: Permission[];
}

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req.user;
  },
);

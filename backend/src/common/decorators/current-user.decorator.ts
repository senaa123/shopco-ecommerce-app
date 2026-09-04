import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';

/** Shape of `request.user` after authentication (JWT or local strategy). */
export interface RequestUser {
  id: string;
  email: string;
  role: Role;
  name?: string;
}

/**
 * Injects the authenticated user (`request.user`) into a route handler
 * parameter. Use behind `JwtAuthGuard` / the local auth guard.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as unknown as RequestUser;
  },
);

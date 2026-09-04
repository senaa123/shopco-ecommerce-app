import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Protects a route by requiring a valid JWT (read from the `access_token`
 * cookie by `JwtStrategy`). On success `request.user` is `{ id, email, role }`.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

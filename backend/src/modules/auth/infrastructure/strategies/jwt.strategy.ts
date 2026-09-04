import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RequestUser } from '../../../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../application/use-cases/login-user.use-case';

/** Pulls the raw JWT out of the `access_token` cookie. */
const cookieExtractor = (req: Request): string | null => {
  const cookies = (req.cookies ?? {}) as Record<string, string | undefined>;
  return cookies['access_token'] ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  validate(payload: JwtPayload): RequestUser {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}

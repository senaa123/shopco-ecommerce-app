import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Strategy } from 'passport-local';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user-repository.interface';

interface ValidatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/**
 * Validates `email` + `password` against the stored bcrypt hash. Used by the
 * `POST /auth/login` route via `AuthGuard('local')`.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<ValidatedUser> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

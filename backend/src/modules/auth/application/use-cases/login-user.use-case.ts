import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { AuthResultDto } from '../dto/auth-result.dto';

/** A user that has already been verified by `LocalStrategy`. */
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface LoginResult {
  accessToken: string;
  result: AuthResultDto;
}

@Injectable()
export class LoginUserUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(user: AuthenticatedUser): Promise<LoginResult> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      result: {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  }
}

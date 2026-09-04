import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user-repository.interface';
import { AuthResultDto } from '../dto/auth-result.dto';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

/** bcrypt cost factor for password hashing. */
const BCRYPT_COST = 12;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(input: RegisterUserInput): Promise<AuthResultDto> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);

    // Role is hard-coded — it is never accepted from the request body.
    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: Role.CUSTOMER,
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

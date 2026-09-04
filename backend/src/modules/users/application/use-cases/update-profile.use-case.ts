import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserProfile } from '../../domain/entities/user.entity';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user-repository.interface';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  /** Only the display name can be changed — email and role are immutable here. */
  async execute(userId: string, name: string): Promise<UserProfile> {
    const existing = await this.userRepository.findById(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }
    const updated = await this.userRepository.updateName(userId, name);
    return UserProfile.fromRecord(updated);
  }
}

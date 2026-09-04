import { Inject, Injectable } from '@nestjs/common';
import { UserProfile } from '../../domain/entities/user.entity';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user-repository.interface';

export interface ListUsersInput {
  page?: number;
  limit?: number;
}

export interface PaginatedUsers {
  data: UserProfile[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(input: ListUsersInput = {}): Promise<PaginatedUsers> {
    const page = Math.max(DEFAULT_PAGE, Math.trunc(input.page ?? DEFAULT_PAGE));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Math.trunc(input.limit ?? DEFAULT_LIMIT)),
    );

    const [records, total] = await Promise.all([
      this.userRepository.findMany({ skip: (page - 1) * limit, take: limit }),
      this.userRepository.count(),
    ]);

    return {
      data: records.map((record) => UserProfile.fromRecord(record)),
      total,
      page,
      limit,
    };
  }
}

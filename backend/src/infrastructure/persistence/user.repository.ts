import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateUserData,
  PaginationParams,
  UserRecord,
  UserRepository,
} from './user-repository.interface';

/**
 * Prisma-backed implementation of {@link UserRepository}. This is the only place
 * `User` queries are written; the auth and users modules consume it through the
 * `USER_REPOSITORY` token.
 */
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: CreateUserData): Promise<UserRecord> {
    return this.prisma.user.create({ data });
  }

  updateName(id: string, name: string): Promise<UserRecord> {
    return this.prisma.user.update({ where: { id }, data: { name } });
  }

  findMany({ skip, take }: PaginationParams): Promise<UserRecord[]> {
    return this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  count(): Promise<number> {
    return this.prisma.user.count();
  }
}

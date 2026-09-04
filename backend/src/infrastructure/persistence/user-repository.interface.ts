import { Role } from '@prisma/client';

/**
 * Shared persistence contract for the `User` aggregate.
 *
 * Both the auth and users modules depend on this single interface (re-exported
 * from their respective `domain/repositories/` folders) so the Prisma queries
 * live in exactly one place — `PrismaUserRepository`.
 */

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}

export interface PaginationParams {
  skip: number;
  take: number;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  create(data: CreateUserData): Promise<UserRecord>;
  updateName(id: string, name: string): Promise<UserRecord>;
  findMany(params: PaginationParams): Promise<UserRecord[]>;
  count(): Promise<number>;
}

/** DI token for {@link UserRepository}. */
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

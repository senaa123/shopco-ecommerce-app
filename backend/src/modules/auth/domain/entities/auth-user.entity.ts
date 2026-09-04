import { Role } from '@prisma/client';

/**
 * Domain view of an authenticated user — deliberately has no password field.
 */
export class AuthUser {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: Role,
  ) {}

  static fromRecord(record: {
    id: string;
    name: string;
    email: string;
    role: Role;
  }): AuthUser {
    return new AuthUser(record.id, record.name, record.email, record.role);
  }
}

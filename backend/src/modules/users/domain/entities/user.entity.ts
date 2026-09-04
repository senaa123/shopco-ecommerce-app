import { Role } from '@prisma/client';

/**
 * Domain view of a user's profile as exposed by the users module — never carries
 * the password hash.
 */
export class UserProfile {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: Role,
    public readonly createdAt: Date,
  ) {}

  static fromRecord(record: {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
  }): UserProfile {
    return new UserProfile(
      record.id,
      record.name,
      record.email,
      record.role,
      record.createdAt,
    );
  }
}

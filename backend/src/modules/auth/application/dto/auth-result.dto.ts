import { Role } from '@prisma/client';

/** The authenticated user as returned to clients — never includes passwordHash. */
export interface AuthUserView {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export class AuthResultDto {
  success: boolean;
  user: AuthUserView;
}

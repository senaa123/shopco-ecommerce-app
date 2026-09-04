/**
 * The users module depends on the same shared user persistence contract as the
 * auth module. Consolidating here avoids duplicating the Prisma queries — the
 * single implementation lives in `infrastructure/persistence/user.repository.ts`.
 */
export * from '../../../../infrastructure/persistence/user-repository.interface';

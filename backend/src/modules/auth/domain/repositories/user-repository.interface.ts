/**
 * The auth module depends on the shared user persistence contract. Keeping this
 * re-export means the Prisma implementation is never duplicated (see the note in
 * the users module).
 */
export * from '../../../../infrastructure/persistence/user-repository.interface';

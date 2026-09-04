/**
 * The users module reuses the shared {@link PrismaUserRepository}; this
 * re-export preserves the Clean Architecture folder layout without duplicating
 * the Prisma queries.
 */
export * from '../../../../infrastructure/persistence/user.repository';

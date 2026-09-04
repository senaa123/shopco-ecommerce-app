/**
 * The auth module reuses the shared {@link PrismaUserRepository} rather than
 * defining its own — this re-export keeps the Clean Architecture folder layout
 * intact without duplicating the Prisma queries.
 */
export * from '../../../../infrastructure/persistence/user.repository';

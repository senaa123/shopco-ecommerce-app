import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './user-repository.interface';
import { PrismaUserRepository } from './user.repository';

/**
 * Binds persistence contracts to their Prisma implementations. Imported by any
 * feature module that needs repository access.
 */
@Module({
  providers: [{ provide: USER_REPOSITORY, useClass: PrismaUserRepository }],
  exports: [USER_REPOSITORY],
})
export class PersistenceModule {}

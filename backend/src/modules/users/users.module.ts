import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { AuthModule } from '../auth/auth.module';
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { UsersController } from './presentation/users.controller';

@Module({
  // AuthModule provides the registered JWT/Passport strategies used by the guards.
  imports: [AuthModule, PersistenceModule],
  controllers: [UsersController],
  providers: [GetProfileUseCase, UpdateProfileUseCase, ListUsersUseCase],
})
export class UsersModule {}

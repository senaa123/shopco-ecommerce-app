import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  type RequestUser,
} from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { UpdateProfileUseCase } from '../application/use-cases/update-profile.use-case';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: RequestUser) {
    return this.getProfileUseCase.execute(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user: RequestUser, @Body() dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute(user.id, dto.name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  list(@Query() query: ListUsersQueryDto) {
    return this.listUsersUseCase.execute({
      page: query.page,
      limit: query.limit,
    });
  }
}

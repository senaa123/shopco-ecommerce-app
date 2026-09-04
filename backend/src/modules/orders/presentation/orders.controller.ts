import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  type RequestUser,
} from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CreateOrderFromCartUseCase } from '../application/use-cases/create-order-from-cart.use-case';
import { GetMyOrdersUseCase } from '../application/use-cases/get-my-orders.use-case';
import { GetOrderByIdUseCase } from '../application/use-cases/get-order-by-id.use-case';
import { ListAllOrdersUseCase } from '../application/use-cases/list-all-orders.use-case';
import { UpdateOrderStatusUseCase } from '../application/use-cases/update-order-status.use-case';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersQueryDto } from './dto/list-orders-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller()
export class OrdersController {
  constructor(
    private readonly createOrderFromCartUseCase: CreateOrderFromCartUseCase,
    private readonly getMyOrdersUseCase: GetMyOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly listAllOrdersUseCase: ListAllOrdersUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('orders')
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateOrderDto) {
    return this.createOrderFromCartUseCase.execute(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  myOrders(@CurrentUser() user: RequestUser) {
    return this.getMyOrdersUseCase.execute(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders/:id')
  getOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.getOrderByIdUseCase.execute(id, {
      id: user.id,
      role: user.role,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/orders')
  listAll(@Query() query: ListOrdersQueryDto) {
    return this.listAllOrdersUseCase.execute(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/orders/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.updateOrderStatusUseCase.execute(id, dto.status);
  }
}

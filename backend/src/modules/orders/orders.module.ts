import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';
import { CreateOrderFromCartUseCase } from './application/use-cases/create-order-from-cart.use-case';
import { GetMyOrdersUseCase } from './application/use-cases/get-my-orders.use-case';
import { GetOrderByIdUseCase } from './application/use-cases/get-order-by-id.use-case';
import { ListAllOrdersUseCase } from './application/use-cases/list-all-orders.use-case';
import { UpdateOrderStatusUseCase } from './application/use-cases/update-order-status.use-case';
import { ORDER_REPOSITORY } from './domain/repositories/order-repository.interface';
import { PrismaOrderRepository } from './infrastructure/persistence/order.repository';
import { OrdersController } from './presentation/orders.controller';

@Module({
  imports: [AuthModule, CartModule],
  controllers: [OrdersController],
  providers: [
    CreateOrderFromCartUseCase,
    GetMyOrdersUseCase,
    GetOrderByIdUseCase,
    ListAllOrdersUseCase,
    UpdateOrderStatusUseCase,
    { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository },
  ],
  exports: [GetOrderByIdUseCase],
})
export class OrdersModule {}

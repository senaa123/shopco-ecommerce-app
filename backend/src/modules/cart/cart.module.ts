import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AddToCartUseCase } from './application/use-cases/add-to-cart.use-case';
import { GetCartUseCase } from './application/use-cases/get-cart.use-case';
import { RemoveCartItemUseCase } from './application/use-cases/remove-cart-item.use-case';
import { UpdateCartItemUseCase } from './application/use-cases/update-cart-item.use-case';
import { CART_REPOSITORY } from './domain/repositories/cart-repository.interface';
import { PrismaCartRepository } from './infrastructure/persistence/cart.repository';
import { CartController } from './presentation/cart.controller';

@Module({
  imports: [AuthModule],
  controllers: [CartController],
  providers: [
    GetCartUseCase,
    AddToCartUseCase,
    UpdateCartItemUseCase,
    RemoveCartItemUseCase,
    { provide: CART_REPOSITORY, useClass: PrismaCartRepository },
  ],
  exports: [CART_REPOSITORY, GetCartUseCase],
})
export class CartModule {}

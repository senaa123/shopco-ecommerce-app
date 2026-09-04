import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  type RequestUser,
} from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { AddToCartUseCase } from '../application/use-cases/add-to-cart.use-case';
import { GetCartUseCase } from '../application/use-cases/get-cart.use-case';
import { RemoveCartItemUseCase } from '../application/use-cases/remove-cart-item.use-case';
import { UpdateCartItemUseCase } from '../application/use-cases/update-cart-item.use-case';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly addToCartUseCase: AddToCartUseCase,
    private readonly updateCartItemUseCase: UpdateCartItemUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
  ) {}

  @Get()
  getCart(@CurrentUser() user: RequestUser) {
    return this.getCartUseCase.execute(user.id);
  }

  @Post('items')
  addItem(@CurrentUser() user: RequestUser, @Body() dto: AddToCartDto) {
    return this.addToCartUseCase.execute(user.id, dto);
  }

  @Patch('items/:id')
  updateItem(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.updateCartItemUseCase.execute(user.id, id, dto.quantity);
  }

  @Delete('items/:id')
  removeItem(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.removeCartItemUseCase.execute(user.id, id);
  }
}

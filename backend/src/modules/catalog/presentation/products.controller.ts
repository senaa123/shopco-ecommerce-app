import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { GetProductBySlugUseCase } from '../application/use-cases/get-product-by-slug.use-case';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case';
import { SoftDeleteProductUseCase } from '../application/use-cases/soft-delete-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductBySlugUseCase: GetProductBySlugUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly softDeleteProductUseCase: SoftDeleteProductUseCase,
  ) {}

  @Get()
  list(@Query() query: QueryProductsDto) {
    return this.listProductsUseCase.execute(query);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.getProductBySlugUseCase.execute(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.updateProductUseCase.execute(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.softDeleteProductUseCase.execute(id);
  }
}

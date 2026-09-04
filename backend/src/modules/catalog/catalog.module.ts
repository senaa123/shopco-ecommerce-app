import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductBySlugUseCase } from './application/use-cases/get-product-by-slug.use-case';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { SoftDeleteProductUseCase } from './application/use-cases/soft-delete-product.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { CATEGORY_REPOSITORY } from './domain/repositories/category-repository.interface';
import { PRODUCT_REPOSITORY } from './domain/repositories/product-repository.interface';
import { PrismaCategoryRepository } from './infrastructure/categories/category.repository';
import { PrismaProductRepository } from './infrastructure/products/product.repository';
import { CategoriesController } from './presentation/categories.controller';
import { ProductsController } from './presentation/products.controller';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController, CategoriesController],
  providers: [
    ListProductsUseCase,
    GetProductBySlugUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    SoftDeleteProductUseCase,
    ListCategoriesUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    { provide: PRODUCT_REPOSITORY, useClass: PrismaProductRepository },
    { provide: CATEGORY_REPOSITORY, useClass: PrismaCategoryRepository },
  ],
  exports: [PRODUCT_REPOSITORY, CATEGORY_REPOSITORY],
})
export class CatalogModule {}

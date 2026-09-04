import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../domain/repositories/product-repository.interface';

/** Admin-only lookup by id (the storefront uses slugs). */
@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}

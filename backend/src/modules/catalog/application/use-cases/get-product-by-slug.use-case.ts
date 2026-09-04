import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../domain/repositories/product-repository.interface';

@Injectable()
export class GetProductBySlugUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(slug: string): Promise<Product> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product || product.isDeleted) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../domain/repositories/product-repository.interface';

@Injectable()
export class SoftDeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product || product.isDeleted) {
      throw new NotFoundException('Product not found');
    }
    // Soft delete only — the row is kept so historical orders still resolve.
    await this.productRepository.softDelete(id);
  }
}

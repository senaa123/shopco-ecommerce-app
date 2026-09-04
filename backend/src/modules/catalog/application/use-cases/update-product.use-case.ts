import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { slugify } from '../../../../common/utils/slugify';
import { Product } from '../../domain/entities/product.entity';
import {
  CATEGORY_REPOSITORY,
  type CategoryRepository,
} from '../../domain/repositories/category-repository.interface';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
  type UpdateProductData,
} from '../../domain/repositories/product-repository.interface';

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  discountPrice?: number | null;
  categoryId?: string;
  type?: string | null;
  dressStyle?: string | null;
  images?: { url: string }[];
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string, input: UpdateProductInput): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product || product.isDeleted) {
      throw new NotFoundException('Product not found');
    }

    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId);
      if (!category) {
        throw new BadRequestException('Category does not exist');
      }
    }

    const data: UpdateProductData = {
      name: input.name,
      description: input.description,
      price: input.price,
      discountPrice: input.discountPrice,
      categoryId: input.categoryId,
      type: input.type,
      dressStyle: input.dressStyle,
    };
    if (input.slug !== undefined) {
      data.slug = slugify(input.slug);
    }
    if (input.images !== undefined) {
      data.images = input.images;
    }

    return this.productRepository.update(id, data);
  }
}

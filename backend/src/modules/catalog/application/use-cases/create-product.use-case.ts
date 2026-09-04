import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
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
} from '../../domain/repositories/product-repository.interface';

export interface CreateProductInput {
  name: string;
  slug?: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  categoryId: string;
  dressStyle?: string | null;
  variants: { size: string; color: string; stock: number }[];
  images: { url: string }[];
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new BadRequestException('Category does not exist');
    }

    if (
      input.discountPrice !== undefined &&
      input.discountPrice !== null &&
      input.discountPrice >= input.price
    ) {
      throw new BadRequestException(
        'discountPrice must be lower than the list price',
      );
    }

    const slug = input.slug ? slugify(input.slug) : slugify(input.name);
    const existing = await this.productRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictException(
        `A product with the slug "${slug}" already exists`,
      );
    }

    return this.productRepository.create({
      name: input.name,
      slug,
      description: input.description,
      price: input.price,
      discountPrice: input.discountPrice ?? null,
      categoryId: input.categoryId,
      dressStyle: input.dressStyle ?? null,
      variants: input.variants,
      images: input.images,
    });
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
  type ProductSort,
} from '../../domain/repositories/product-repository.interface';

export interface ListProductsQuery {
  categorySlug?: string;
  types?: string[];
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  dressStyle?: string;
  search?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export interface ListProductsResult {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: ListProductsQuery): Promise<ListProductsResult> {
    const page = Math.max(DEFAULT_PAGE, Math.trunc(query.page ?? DEFAULT_PAGE));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Math.trunc(query.limit ?? DEFAULT_LIMIT)),
    );

    const { data, total } = await this.productRepository.findMany({
      categorySlug: query.categorySlug,
      types: query.types?.filter(Boolean),
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      color: query.color,
      size: query.size,
      dressStyle: query.dressStyle,
      search: query.search,
      sort: query.sort ?? 'newest',
      page,
      limit,
    });

    return { data, total, page, limit };
  }
}

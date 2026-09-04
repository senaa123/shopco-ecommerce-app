import { Category } from './category.entity';
import { ProductVariant } from './product-variant.entity';

export interface ProductImage {
  id: string;
  url: string;
}

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly price: number,
    public readonly discountPrice: number | null,
    public readonly categoryId: string,
    public readonly type: string | null,
    public readonly dressStyle: string | null,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly category: Category | null = null,
    public readonly variants: ProductVariant[] = [],
    public readonly images: ProductImage[] = [],
    public readonly averageRating: number = 0,
    public readonly reviewCount: number = 0,
  ) {}
}

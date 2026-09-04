import { Product } from '../entities/product.entity';

export type ProductSort = 'price_asc' | 'price_desc' | 'newest' | 'popular';

export interface ProductListFilters {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  dressStyle?: string;
  search?: string;
  sort: ProductSort;
  page: number;
  limit: number;
}

export interface CreateVariantData {
  size: string;
  color: string;
  stock: number;
}

export interface CreateImageData {
  url: string;
}

export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  categoryId: string;
  dressStyle?: string | null;
  variants: CreateVariantData[];
  images: CreateImageData[];
}

export interface UpdateProductData {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  discountPrice?: number | null;
  categoryId?: string;
  dressStyle?: string | null;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
}

export interface ProductRepository {
  /** Dynamic filter / sort / pagination query. Always excludes `isDeleted`. */
  findMany(filters: ProductListFilters): Promise<PaginatedProducts>;
  /** Full detail incl. variants, images, category and average rating. */
  findBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  /** Creates the product with its variants and images in one transaction. */
  create(data: CreateProductData): Promise<Product>;
  update(id: string, data: UpdateProductData): Promise<Product>;
  softDelete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

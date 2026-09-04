import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type { ProductSort } from '../../domain/repositories/product-repository.interface';

const SORT_VALUES: ProductSort[] = [
  'price_asc',
  'price_desc',
  'newest',
  'popular',
];

export class QueryProductsDto {
  @IsOptional()
  @IsString()
  categorySlug?: string;

  /**
   * Product type(s) — a single value or a comma-separated list
   * (`?types=T-shirts,Jeans`) for multi-select checkboxes.
   */
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
      : value,
  )
  @IsArray()
  @IsString({ each: true })
  types?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  dressStyle?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(SORT_VALUES)
  sort?: ProductSort;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

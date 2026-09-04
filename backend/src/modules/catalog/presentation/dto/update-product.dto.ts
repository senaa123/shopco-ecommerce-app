import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateProductImageDto } from './create-product.dto';

/**
 * Updates scalar product fields, and optionally replaces the whole image set.
 * Variant editing is still done at creation.
 */
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsPositive()
  discountPrice?: number | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsOptional()
  @IsString()
  type?: string | null;

  @IsOptional()
  @IsString()
  dressStyle?: string | null;

  /** When present, replaces every image on the product. */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];
}

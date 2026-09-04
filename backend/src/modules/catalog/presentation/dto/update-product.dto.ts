import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

/**
 * Updates scalar product fields only. Variants and images are managed through
 * their own endpoints in a later prompt.
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
}

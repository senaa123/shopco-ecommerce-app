import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}

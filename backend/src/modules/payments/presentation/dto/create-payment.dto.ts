import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export type PaymentMethod = 'CARD' | 'COD';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsIn(['CARD', 'COD'])
  method: PaymentMethod;
}

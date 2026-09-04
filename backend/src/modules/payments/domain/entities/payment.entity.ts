import { PaymentStatus } from '@prisma/client';

export class Payment {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly method: string,
    public readonly status: PaymentStatus,
    public readonly transactionRef: string | null,
    public readonly amount: number,
    public readonly createdAt: Date,
  ) {}
}

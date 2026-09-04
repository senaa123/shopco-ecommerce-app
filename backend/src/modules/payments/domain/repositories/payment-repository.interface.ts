import { Payment } from '../entities/payment.entity';

export interface RecordPaymentData {
  orderId: string;
  method: string;
  transactionRef: string | null;
  amount: number;
}

export interface PaymentRepository {
  findByOrderId(orderId: string): Promise<Payment | null>;
  /** Upserts a SUCCESS payment and flips the order to PAID in one transaction. */
  recordSuccess(data: RecordPaymentData): Promise<Payment>;
  /** Upserts a FAILED payment; the order is left untouched. */
  recordFailure(data: RecordPaymentData): Promise<Payment>;
}

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

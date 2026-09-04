/**
 * Abstraction over a payment provider. The app depends only on this contract;
 * `payments.module.ts` binds it to `MockPaymentGateway` today, and swapping in a
 * real Stripe/PayPal adapter later is a one-line change to that binding.
 */

export interface ChargeResult {
  success: boolean;
  transactionRef: string;
}

export interface PaymentGateway {
  charge(amount: number, method: string): Promise<ChargeResult>;
}

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

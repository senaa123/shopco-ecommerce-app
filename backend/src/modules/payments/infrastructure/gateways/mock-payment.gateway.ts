import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  ChargeResult,
  PaymentGateway,
} from '../../domain/gateways/payment-gateway.interface';

/**
 * Fake payment gateway for local development. Card charges succeed ~90% of the
 * time (a random 10% failure keeps the retry path exercised); cash-on-delivery
 * always "succeeds" since nothing is actually charged up front.
 */
@Injectable()
export class MockPaymentGateway implements PaymentGateway {
  private readonly logger = new Logger(MockPaymentGateway.name);
  private readonly failureRate = 0.1;

  charge(amount: number, method: string): Promise<ChargeResult> {
    const transactionRef = `mock_${randomUUID()}`;
    const success = method === 'COD' || Math.random() >= this.failureRate;

    this.logger.log(
      `charge ${amount} via ${method} -> ${success ? 'SUCCESS' : 'FAILED'} (${transactionRef})`,
    );

    return Promise.resolve({ success, transactionRef });
  }
}

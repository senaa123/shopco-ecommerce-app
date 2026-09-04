import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrdersModule } from '../orders/orders.module';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { PAYMENT_GATEWAY } from './domain/gateways/payment-gateway.interface';
import { PAYMENT_REPOSITORY } from './domain/repositories/payment-repository.interface';
import { MockPaymentGateway } from './infrastructure/gateways/mock-payment.gateway';
import { PrismaPaymentRepository } from './infrastructure/persistence/payment.repository';
import { PaymentsController } from './presentation/payments.controller';

@Module({
  imports: [AuthModule, OrdersModule],
  controllers: [PaymentsController],
  providers: [
    ProcessPaymentUseCase,
    { provide: PAYMENT_REPOSITORY, useClass: PrismaPaymentRepository },
    // Swap this binding for a real gateway adapter (Stripe/PayPal) later.
    { provide: PAYMENT_GATEWAY, useClass: MockPaymentGateway },
  ],
})
export class PaymentsModule {}

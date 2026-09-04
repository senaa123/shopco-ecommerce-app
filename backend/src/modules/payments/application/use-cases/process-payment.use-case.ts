import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { OrderStatus, PaymentStatus, Role } from '@prisma/client';
import { GetOrderByIdUseCase } from '../../../orders/application/use-cases/get-order-by-id.use-case';
import { Payment } from '../../domain/entities/payment.entity';
import {
  PAYMENT_GATEWAY,
  type PaymentGateway,
} from '../../domain/gateways/payment-gateway.interface';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepository,
} from '../../domain/repositories/payment-repository.interface';

export interface ProcessPaymentInput {
  orderId: string;
  method: 'CARD' | 'COD';
  userId: string;
  role: Role;
}

export interface ProcessPaymentResult {
  success: true;
  payment: Payment;
}

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGateway,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
  ) {}

  async execute(input: ProcessPaymentInput): Promise<ProcessPaymentResult> {
    // Reuse the orders use-case: it 404s on missing and 403s if the order is
    // not the requester's (admins may pay any order).
    const order = await this.getOrderByIdUseCase.execute(input.orderId, {
      id: input.userId,
      role: input.role,
    });

    const existing = await this.paymentRepository.findByOrderId(order.id);
    if (existing?.status === PaymentStatus.SUCCESS) {
      throw new ConflictException('This order has already been paid');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Order is ${order.status} and cannot be paid`,
      );
    }

    const charge = await this.paymentGateway.charge(order.total, input.method);

    if (!charge.success) {
      await this.paymentRepository.recordFailure({
        orderId: order.id,
        method: input.method,
        transactionRef: charge.transactionRef,
        amount: order.total,
      });
      throw new HttpException(
        'Payment was declined. No charge was made — please try again.',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const payment = await this.paymentRepository.recordSuccess({
      orderId: order.id,
      method: input.method,
      transactionRef: charge.transactionRef,
      amount: order.total,
    });

    return { success: true, payment };
  }
}

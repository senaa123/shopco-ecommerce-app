import { Injectable } from '@nestjs/common';
import {
  OrderStatus,
  Payment as PaymentRow,
  PaymentStatus,
} from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { Payment } from '../../domain/entities/payment.entity';
import {
  PaymentRepository,
  RecordPaymentData,
} from '../../domain/repositories/payment-repository.interface';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const row = await this.prisma.payment.findUnique({ where: { orderId } });
    return row ? this.mapRow(row) : null;
  }

  async recordSuccess(data: RecordPaymentData): Promise<Payment> {
    const row = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.upsert({
        where: { orderId: data.orderId },
        create: {
          orderId: data.orderId,
          method: data.method,
          status: PaymentStatus.SUCCESS,
          transactionRef: data.transactionRef,
          amount: data.amount,
        },
        update: {
          method: data.method,
          status: PaymentStatus.SUCCESS,
          transactionRef: data.transactionRef,
          amount: data.amount,
        },
      });

      await tx.order.update({
        where: { id: data.orderId },
        data: { status: OrderStatus.PAID },
      });

      return payment;
    });

    return this.mapRow(row);
  }

  async recordFailure(data: RecordPaymentData): Promise<Payment> {
    const row = await this.prisma.payment.upsert({
      where: { orderId: data.orderId },
      create: {
        orderId: data.orderId,
        method: data.method,
        status: PaymentStatus.FAILED,
        transactionRef: data.transactionRef,
        amount: data.amount,
      },
      update: {
        method: data.method,
        status: PaymentStatus.FAILED,
        transactionRef: data.transactionRef,
        amount: data.amount,
      },
    });
    return this.mapRow(row);
  }

  private mapRow(row: PaymentRow): Payment {
    return new Payment(
      row.id,
      row.orderId,
      row.method,
      row.status,
      row.transactionRef,
      row.amount.toNumber(),
      row.createdAt,
    );
  }
}

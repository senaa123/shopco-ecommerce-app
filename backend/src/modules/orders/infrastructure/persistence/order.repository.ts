import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import {
  OrderRepository,
  PaginatedOrders,
  PlaceOrderInput,
} from '../../domain/repositories/order-repository.interface';

const orderInclude = {
  items: {
    include: {
      variant: {
        include: { product: { select: { id: true, name: true, slug: true } } },
      },
    },
  },
  payment: true,
} satisfies Prisma.OrderInclude;

type OrderRow = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async placeOrder(input: PlaceOrderInput): Promise<Order> {
    const row = await this.prisma.$transaction(async (tx) => {
      // Re-check stock inside the transaction to guard against races.
      for (const line of input.lines) {
        const variant = await tx.productVariant.findUnique({
          where: { id: line.variantId },
          select: { stock: true },
        });
        if (!variant || variant.stock < line.quantity) {
          throw new BadRequestException(
            `Insufficient stock for variant ${line.variantId}`,
          );
        }
      }

      for (const line of input.lines) {
        await tx.productVariant.update({
          where: { id: line.variantId },
          data: { stock: { decrement: line.quantity } },
        });
      }

      const created = await tx.order.create({
        data: {
          userId: input.userId,
          status: OrderStatus.PENDING,
          subtotal: input.subtotal,
          discount: input.discount,
          deliveryFee: input.deliveryFee,
          total: input.total,
          items: {
            create: input.lines.map((line) => ({
              variantId: line.variantId,
              quantity: line.quantity,
              priceAtPurchase: line.priceAtPurchase,
            })),
          },
        },
        include: orderInclude,
      });

      await tx.cartItem.deleteMany({ where: { userId: input.userId } });

      return created;
    });

    return this.mapRow(row);
  }

  async findByUser(userId: string): Promise<Order[]> {
    const rows = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: orderInclude,
    });
    return rows.map((row) => this.mapRow(row));
  }

  async findById(id: string): Promise<Order | null> {
    const row = await this.prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
    return row ? this.mapRow(row) : null;
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedOrders> {
    const [rows, total] = await Promise.all([
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: orderInclude,
      }),
      this.prisma.order.count(),
    ]);
    return { data: rows.map((row) => this.mapRow(row)), total };
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const row = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    });
    return this.mapRow(row);
  }

  private mapRow(row: OrderRow): Order {
    const items = row.items.map((item) => {
      const priceAtPurchase = item.priceAtPurchase.toNumber();
      return new OrderItem(
        item.id,
        item.orderId,
        item.variantId,
        item.quantity,
        priceAtPurchase,
        Math.round(priceAtPurchase * item.quantity * 100) / 100,
        {
          id: item.variant.id,
          size: item.variant.size,
          color: item.variant.color,
        },
        {
          id: item.variant.product.id,
          name: item.variant.product.name,
          slug: item.variant.product.slug,
        },
      );
    });

    return new Order(
      row.id,
      row.userId,
      row.status,
      row.subtotal.toNumber(),
      row.discount.toNumber(),
      row.deliveryFee.toNumber(),
      row.total.toNumber(),
      items,
      row.createdAt,
      row.updatedAt,
      row.payment
        ? {
            id: row.payment.id,
            method: row.payment.method,
            status: row.payment.status,
            amount: row.payment.amount.toNumber(),
            transactionRef: row.payment.transactionRef,
          }
        : null,
    );
  }
}

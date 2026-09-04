import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { CartItem } from '../../domain/entities/cart-item.entity';
import {
  AddCartItemData,
  CartItemRef,
  CartRepository,
  VariantForCart,
} from '../../domain/repositories/cart-repository.interface';

type CartItemRow = Prisma.CartItemGetPayload<{
  include: {
    variant: {
      include: {
        product: { include: { images: { take: 1 } } };
      };
    };
  };
}>;

const round = (value: number): number => Math.round(value * 100) / 100;

const effectivePrice = (
  price: Prisma.Decimal,
  discountPrice: Prisma.Decimal | null,
): number => (discountPrice ?? price).toNumber();

@Injectable()
export class PrismaCartRepository implements CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findItemsByUser(userId: string): Promise<CartItem[]> {
    const rows = await this.prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      include: {
        variant: {
          include: { product: { include: { images: { take: 1 } } } },
        },
      },
    });
    return rows.map((row) => this.mapRow(row));
  }

  async findItemById(id: string): Promise<CartItemRef | null> {
    return this.prisma.cartItem.findUnique({
      where: { id },
      select: { id: true, userId: true, variantId: true, quantity: true },
    });
  }

  async findItemByUserAndVariant(
    userId: string,
    variantId: string,
  ): Promise<CartItemRef | null> {
    return this.prisma.cartItem.findFirst({
      where: { userId, variantId },
      select: { id: true, userId: true, variantId: true, quantity: true },
    });
  }

  async findVariantForCart(variantId: string): Promise<VariantForCart | null> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: { include: { images: { take: 1 } } } },
    });
    if (!variant) {
      return null;
    }
    return {
      id: variant.id,
      size: variant.size,
      color: variant.color,
      stock: variant.stock,
      productId: variant.productId,
      product: {
        id: variant.product.id,
        name: variant.product.name,
        slug: variant.product.slug,
        price: variant.product.price.toNumber(),
        discountPrice: variant.product.discountPrice
          ? variant.product.discountPrice.toNumber()
          : null,
        imageUrl: variant.product.images[0]?.url ?? null,
      },
    };
  }

  async addItem(data: AddCartItemData): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await this.reserveStock(tx, data.variantId, data.quantity);

      const existing = await tx.cartItem.findFirst({
        where: { userId: data.userId, variantId: data.variantId },
        select: { id: true },
      });
      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: { increment: data.quantity } },
        });
      } else {
        await tx.cartItem.create({ data });
      }
    });
  }

  async setItemQuantity(id: string, quantity: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const item = await tx.cartItem.findUnique({
        where: { id },
        select: { quantity: true, variantId: true },
      });
      if (!item) {
        return;
      }
      const delta = quantity - item.quantity;
      if (delta > 0) {
        await this.reserveStock(tx, item.variantId, delta, item.quantity);
      } else if (delta < 0) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: -delta } },
        });
      }
      await tx.cartItem.update({ where: { id }, data: { quantity } });
    });
  }

  async removeItem(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const item = await tx.cartItem.findUnique({
        where: { id },
        select: { quantity: true, variantId: true },
      });
      if (!item) {
        return;
      }
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });
      await tx.cartItem.delete({ where: { id } });
    });
  }

  /**
   * Conditionally decrements `stock` by `units` — the `WHERE stock >= units`
   * clause makes it race-safe (the row lock re-checks it). `alreadyHeld` is the
   * quantity this cart line already reserves, used only for the error message.
   */
  private async reserveStock(
    tx: Prisma.TransactionClient,
    variantId: string,
    units: number,
    alreadyHeld = 0,
  ): Promise<void> {
    const result = await tx.productVariant.updateMany({
      where: { id: variantId, stock: { gte: units } },
      data: { stock: { decrement: units } },
    });
    if (result.count === 0) {
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
        select: { stock: true },
      });
      const available = (variant?.stock ?? 0) + alreadyHeld;
      throw new BadRequestException(
        `Only ${available} available in stock for this variant`,
      );
    }
  }

  private mapRow(row: CartItemRow): CartItem {
    const unitPrice = effectivePrice(
      row.variant.product.price,
      row.variant.product.discountPrice,
    );
    return new CartItem(
      row.id,
      row.userId,
      row.productId,
      row.variantId,
      row.quantity,
      unitPrice,
      round(unitPrice * row.quantity),
      row.createdAt,
      {
        id: row.variant.product.id,
        name: row.variant.product.name,
        slug: row.variant.product.slug,
        price: row.variant.product.price.toNumber(),
        discountPrice: row.variant.product.discountPrice
          ? row.variant.product.discountPrice.toNumber()
          : null,
        imageUrl: row.variant.product.images[0]?.url ?? null,
      },
      {
        id: row.variant.id,
        size: row.variant.size,
        color: row.variant.color,
        stock: row.variant.stock,
      },
    );
  }
}

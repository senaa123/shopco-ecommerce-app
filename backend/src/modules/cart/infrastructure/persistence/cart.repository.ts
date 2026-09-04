import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { CartItem } from '../../domain/entities/cart-item.entity';
import {
  CartItemRef,
  CartRepository,
  CreateCartItemData,
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

  async createItem(data: CreateCartItemData): Promise<void> {
    await this.prisma.cartItem.create({ data });
  }

  async updateItemQuantity(id: string, quantity: number): Promise<void> {
    await this.prisma.cartItem.update({ where: { id }, data: { quantity } });
  }

  async deleteItem(id: string): Promise<void> {
    await this.prisma.cartItem.delete({ where: { id } });
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

import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { Review } from '../../domain/entities/review.entity';
import {
  CreateReviewData,
  PaginatedReviews,
  ReviewRepository,
} from '../../domain/repositories/review-repository.interface';

type ReviewRow = Prisma.ReviewGetPayload<{
  include: { user: { select: { name: true } } };
}>;

@Injectable()
export class PrismaReviewRepository implements ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async productExists(productId: string): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { id: productId, isDeleted: false },
    });
    return count > 0;
  }

  async findByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<Review | null> {
    const row = await this.prisma.review.findFirst({
      where: { userId, productId },
      include: { user: { select: { name: true } } },
    });
    return row ? this.mapRow(row) : null;
  }

  async hasDeliveredOrderWithProduct(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const count = await this.prisma.order.count({
      where: {
        userId,
        status: OrderStatus.DELIVERED,
        items: { some: { variant: { productId } } },
      },
    });
    return count > 0;
  }

  async create(data: CreateReviewData): Promise<Review> {
    const row = await this.prisma.review.create({
      data,
      include: { user: { select: { name: true } } },
    });
    return this.mapRow(row);
  }

  async listByProduct(
    productId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedReviews> {
    const [rows, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { user: { select: { name: true } } },
      }),
      this.prisma.review.count({ where: { productId } }),
    ]);
    return { data: rows.map((row) => this.mapRow(row)), total };
  }

  private mapRow(row: ReviewRow): Review {
    return new Review(
      row.id,
      row.productId,
      row.userId,
      row.rating,
      row.comment,
      row.createdAt,
      row.user.name,
    );
  }
}

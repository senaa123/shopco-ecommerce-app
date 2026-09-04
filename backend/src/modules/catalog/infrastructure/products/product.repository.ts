import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { Product, ProductImage } from '../../domain/entities/product.entity';
import { Category } from '../../domain/entities/category.entity';
import { ProductVariant } from '../../domain/entities/product-variant.entity';
import {
  CreateProductData,
  PaginatedProducts,
  ProductListFilters,
  ProductRepository,
  UpdateProductData,
} from '../../domain/repositories/product-repository.interface';

type ProductDetailRow = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
    variants: true;
    reviews: { select: { rating: true } };
  };
}>;

// The list rows carry the same shape as the detail rows (ratings included so the
// average can be computed on the fly rather than stored on the product).
type ProductListRow = ProductDetailRow;

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filters: ProductListFilters): Promise<PaginatedProducts> {
    const where = this.buildWhere(filters);
    const skip = (filters.page - 1) * filters.limit;

    const [rows, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: this.buildOrderBy(filters.sort),
        skip,
        take: filters.limit,
        include: {
          category: true,
          images: true,
          variants: true,
          reviews: { select: { rating: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: rows.map((row) => this.mapListRow(row)),
      total,
    };
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const row = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        variants: true,
        reviews: { select: { rating: true } },
      },
    });
    return row ? this.mapDetailRow(row) : null;
  }

  async findById(id: string): Promise<Product | null> {
    const row = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        variants: true,
        reviews: { select: { rating: true } },
      },
    });
    return row ? this.mapDetailRow(row) : null;
  }

  async create(data: CreateProductData): Promise<Product> {
    const created = await this.prisma.$transaction(async (tx) => {
      return tx.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          discountPrice: data.discountPrice ?? null,
          type: data.type ?? null,
          dressStyle: data.dressStyle ?? null,
          category: { connect: { id: data.categoryId } },
          variants: { create: data.variants },
          images: { create: data.images },
        },
        include: {
          category: true,
          images: true,
          variants: true,
          reviews: { select: { rating: true } },
        },
      });
    });
    return this.mapDetailRow(created);
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    const row = await this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice,
        type: data.type,
        dressStyle: data.dressStyle,
        ...(data.categoryId
          ? { category: { connect: { id: data.categoryId } } }
          : {}),
      },
      include: {
        category: true,
        images: true,
        variants: true,
        reviews: { select: { rating: true } },
      },
    });
    return this.mapDetailRow(row);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  private buildWhere(filters: ProductListFilters): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = { isDeleted: false };

    if (filters.categorySlug) {
      where.category = { slug: filters.categorySlug };
    }
    if (filters.types && filters.types.length > 0) {
      where.type = { in: filters.types };
    }
    if (filters.dressStyle) {
      where.dressStyle = filters.dressStyle;
    }
    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }
    if (filters.color || filters.size) {
      where.variants = {
        some: {
          ...(filters.color ? { color: filters.color } : {}),
          ...(filters.size ? { size: filters.size } : {}),
        },
      };
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const bounds: { gte?: number; lte?: number } = {};
      if (filters.minPrice !== undefined) {
        bounds.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        bounds.lte = filters.maxPrice;
      }
      // Match on the effective price: the discount price when present,
      // otherwise the list price.
      where.OR = [
        { discountPrice: { not: null, ...bounds } },
        { discountPrice: null, price: { ...bounds } },
      ];
    }

    return where;
  }

  private buildOrderBy(
    sort: ProductListFilters['sort'],
  ): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
      case 'price_asc':
        return { price: 'asc' };
      case 'price_desc':
        return { price: 'desc' };
      case 'popular':
        return { reviews: { _count: 'desc' } };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  }

  private mapImages(rows: { id: string; url: string }[]): ProductImage[] {
    return rows.map((image) => ({ id: image.id, url: image.url }));
  }

  private mapVariants(
    rows: {
      id: string;
      productId: string;
      size: string;
      color: string;
      stock: number;
    }[],
  ): ProductVariant[] {
    return rows.map((variant) => ProductVariant.fromRecord(variant));
  }

  private mapListRow(row: ProductListRow): Product {
    return this.mapDetailRow(row);
  }

  private mapDetailRow(row: ProductDetailRow): Product {
    const ratings = row.reviews.map((review) => review.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    return new Product(
      row.id,
      row.name,
      row.slug,
      row.description,
      row.price.toNumber(),
      row.discountPrice ? row.discountPrice.toNumber() : null,
      row.categoryId,
      row.type,
      row.dressStyle,
      row.isDeleted,
      row.createdAt,
      row.updatedAt,
      row.category ? Category.fromRecord(row.category) : null,
      this.mapVariants(row.variants),
      this.mapImages(row.images),
      Math.round(averageRating * 100) / 100,
      ratings.length,
    );
  }
}

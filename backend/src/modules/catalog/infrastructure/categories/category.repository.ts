import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { Category } from '../../domain/entities/category.entity';
import {
  CategoryRepository,
  CreateCategoryData,
  UpdateCategoryData,
} from '../../domain/repositories/category-repository.interface';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    const rows = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => Category.fromRecord(row));
  }

  async findById(id: string): Promise<Category | null> {
    const row = await this.prisma.category.findUnique({ where: { id } });
    return row ? Category.fromRecord(row) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const row = await this.prisma.category.findUnique({ where: { slug } });
    return row ? Category.fromRecord(row) : null;
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const row = await this.prisma.category.create({ data });
    return Category.fromRecord(row);
  }

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    const row = await this.prisma.category.update({ where: { id }, data });
    return Category.fromRecord(row);
  }
}

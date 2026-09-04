import { Category } from '../entities/category.entity';

export interface CreateCategoryData {
  name: string;
  slug: string;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
}

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  create(data: CreateCategoryData): Promise<Category>;
  update(id: string, data: UpdateCategoryData): Promise<Category>;
}

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { slugify } from '../../../../common/utils/slugify';
import { Category } from '../../domain/entities/category.entity';
import {
  CATEGORY_REPOSITORY,
  type CategoryRepository,
} from '../../domain/repositories/category-repository.interface';

export interface CreateCategoryInput {
  name: string;
  slug?: string;
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: CreateCategoryInput): Promise<Category> {
    const slug = input.slug ? slugify(input.slug) : slugify(input.name);

    const existing = await this.categoryRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictException(
        `A category with the slug "${slug}" already exists`,
      );
    }

    return this.categoryRepository.create({ name: input.name, slug });
  }
}

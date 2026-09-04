import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { slugify } from '../../../../common/utils/slugify';
import { Category } from '../../domain/entities/category.entity';
import {
  CATEGORY_REPOSITORY,
  type CategoryRepository,
  type UpdateCategoryData,
} from '../../domain/repositories/category-repository.interface';

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
}

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string, input: UpdateCategoryInput): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const data: UpdateCategoryData = { name: input.name };

    if (input.slug !== undefined) {
      const slug = slugify(input.slug);
      const clash = await this.categoryRepository.findBySlug(slug);
      if (clash && clash.id !== id) {
        throw new ConflictException(
          `A category with the slug "${slug}" already exists`,
        );
      }
      data.slug = slug;
    }

    return this.categoryRepository.update(id, data);
  }
}

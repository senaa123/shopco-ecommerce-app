import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import {
  CATEGORY_REPOSITORY,
  type CategoryRepository,
} from '../../domain/repositories/category-repository.interface';

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}

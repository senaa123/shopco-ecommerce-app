import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Review } from '../../domain/entities/review.entity';
import {
  REVIEW_REPOSITORY,
  type ReviewRepository,
} from '../../domain/repositories/review-repository.interface';

export interface ListProductReviewsInput {
  productId: string;
  page?: number;
  limit?: number;
}

export interface ListProductReviewsResult {
  data: Review[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

@Injectable()
export class ListProductReviewsUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(
    input: ListProductReviewsInput,
  ): Promise<ListProductReviewsResult> {
    const productExists = await this.reviewRepository.productExists(
      input.productId,
    );
    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    const page = Math.max(DEFAULT_PAGE, Math.trunc(input.page ?? DEFAULT_PAGE));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Math.trunc(input.limit ?? DEFAULT_LIMIT)),
    );

    const { data, total } = await this.reviewRepository.listByProduct(
      input.productId,
      page,
      limit,
    );

    return { data, total, page, limit };
  }
}

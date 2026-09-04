import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Review } from '../../domain/entities/review.entity';
import {
  REVIEW_REPOSITORY,
  type ReviewRepository,
} from '../../domain/repositories/review-repository.interface';

export interface CreateReviewInput {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(input: CreateReviewInput): Promise<Review> {
    const productExists = await this.reviewRepository.productExists(
      input.productId,
    );
    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.reviewRepository.findByUserAndProduct(
      input.userId,
      input.productId,
    );
    if (existing) {
      throw new ConflictException('You have already reviewed this product');
    }

    const purchased = await this.reviewRepository.hasDeliveredOrderWithProduct(
      input.userId,
      input.productId,
    );
    if (!purchased) {
      throw new ForbiddenException(
        'You can only review a product from one of your delivered orders',
      );
    }

    return this.reviewRepository.create({
      productId: input.productId,
      userId: input.userId,
      rating: input.rating,
      comment: input.comment,
    });
  }
}

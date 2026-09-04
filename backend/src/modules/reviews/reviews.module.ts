import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CreateReviewUseCase } from './application/use-cases/create-review.use-case';
import { ListProductReviewsUseCase } from './application/use-cases/list-product-reviews.use-case';
import { REVIEW_REPOSITORY } from './domain/repositories/review-repository.interface';
import { PrismaReviewRepository } from './infrastructure/persistence/review.repository';
import { ReviewsController } from './presentation/reviews.controller';

@Module({
  imports: [AuthModule],
  controllers: [ReviewsController],
  providers: [
    CreateReviewUseCase,
    ListProductReviewsUseCase,
    { provide: REVIEW_REPOSITORY, useClass: PrismaReviewRepository },
  ],
})
export class ReviewsModule {}

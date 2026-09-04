import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  type RequestUser,
} from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CreateReviewUseCase } from '../application/use-cases/create-review.use-case';
import { ListProductReviewsUseCase } from '../application/use-cases/list-product-reviews.use-case';
import { CreateReviewDto } from './dto/create-review.dto';
import { ListReviewsQueryDto } from './dto/list-reviews-query.dto';

@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly listProductReviewsUseCase: ListProductReviewsUseCase,
  ) {}

  @Get()
  list(
    @Param('productId') productId: string,
    @Query() query: ListReviewsQueryDto,
  ) {
    return this.listProductReviewsUseCase.execute({
      productId,
      page: query.page,
      limit: query.limit,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.createReviewUseCase.execute({
      productId,
      userId: user.id,
      rating: dto.rating,
      comment: dto.comment,
    });
  }
}

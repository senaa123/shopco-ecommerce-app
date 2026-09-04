import { Review } from '../entities/review.entity';

export interface CreateReviewData {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}

export interface PaginatedReviews {
  data: Review[];
  total: number;
}

export interface ReviewRepository {
  productExists(productId: string): Promise<boolean>;
  findByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<Review | null>;
  /** True when the user has a DELIVERED order containing this product. */
  hasDeliveredOrderWithProduct(
    userId: string,
    productId: string,
  ): Promise<boolean>;
  create(data: CreateReviewData): Promise<Review>;
  listByProduct(
    productId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedReviews>;
}

export const REVIEW_REPOSITORY = Symbol('REVIEW_REPOSITORY');

export class Review {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly userId: string,
    public readonly rating: number,
    public readonly comment: string,
    public readonly createdAt: Date,
    public readonly reviewerName: string | null = null,
  ) {}
}

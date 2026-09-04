export class ProductVariant {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly size: string,
    public readonly color: string,
    public readonly stock: number,
  ) {}

  static fromRecord(record: {
    id: string;
    productId: string;
    size: string;
    color: string;
    stock: number;
  }): ProductVariant {
    return new ProductVariant(
      record.id,
      record.productId,
      record.size,
      record.color,
      record.stock,
    );
  }
}

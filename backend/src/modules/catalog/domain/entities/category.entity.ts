export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromRecord(record: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  }): Category {
    return new Category(
      record.id,
      record.name,
      record.slug,
      record.createdAt,
      record.updatedAt,
    );
  }
}

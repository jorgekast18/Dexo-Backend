export class CategoryModel {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly transactionTypeId: string,
    public readonly description?: string,
  ) {}
}

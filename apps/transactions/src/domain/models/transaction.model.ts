export class TransactionModel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly transactionTypeId: string,
    public readonly categoryId: string,
    public readonly amount: number,
    public readonly description?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static createTransaction(
    userId: string,
    transactionTypeId: string,
    categoryId: string,
    amount: number,
    description?: string
  ): TransactionModel {
    return new TransactionModel(
      '',
      userId,
      transactionTypeId,
      categoryId,
      amount,
      description
    );
  }
}

import { TransactionModel } from '../models/transaction.model';

export interface ITransactionRepository {
  create(transaction: TransactionModel): Promise<TransactionModel>;
  findById(id: string): Promise<TransactionModel | null>;
  findAll(userId: string): Promise<TransactionModel[]>;
  update(id: string, transaction: Partial<TransactionModel>): Promise<TransactionModel>;
  delete(id: string): Promise<void>;
}

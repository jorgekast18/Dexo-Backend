import { TransactionTypeModel } from '../models/transaction-type.model';

export interface ITransactionTypeRepository {
  findById(id: string): Promise<TransactionTypeModel | null>;
  findAll(): Promise<TransactionTypeModel[]>;
}

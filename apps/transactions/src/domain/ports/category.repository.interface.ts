import { CategoryModel } from '../models/category.model';

export interface ICategoryRepository {
  findById(id: string): Promise<CategoryModel | null>;
  findByTransactionType(transactionTypeId: string): Promise<CategoryModel[]>;
}

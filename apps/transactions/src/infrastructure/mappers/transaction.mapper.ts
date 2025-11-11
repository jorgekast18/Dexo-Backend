import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionModel } from '../../domain/models/transaction.model';

export class TransactionMapper {
  static toDomain(entity: TransactionEntity): TransactionModel {
    return new TransactionModel(
      entity.id,
      entity.userId,
      entity.transactionTypeId,
      entity.categoryId,
      parseFloat(entity.amount.toString()),
      entity.description,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(model: TransactionModel): TransactionEntity {
    const entity = new TransactionEntity();
    if (model.id) entity.id = model.id;
    entity.userId = model.userId;
    entity.transactionTypeId = model.transactionTypeId;
    entity.categoryId = model.categoryId;
    entity.amount = model.amount;
    entity.description = model.description;
    return entity;
  }
}

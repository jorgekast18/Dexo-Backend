import { TransactionTypeEntity } from '../entities/transaction-type.entity';
import { TransactionTypeModel } from '../../domain/models/transaction-type.model';

export class TransactionTypeMapper {
  static toDomain(entity: TransactionTypeEntity): TransactionTypeModel {
    return new TransactionTypeModel(
      entity.id,
      entity.name,
      entity.description,
    );
  }
}

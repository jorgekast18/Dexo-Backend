import { CategoryEntity } from '../entities/category.entity';
import { CategoryModel } from '../../domain/models/category.model';

export class CategoryMapper {
  static toDomain(entity: CategoryEntity): CategoryModel {
    return new CategoryModel(
      entity.id,
      entity.name,
      entity.transactionTypeId,
      entity.description,
    );
  }
}

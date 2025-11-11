import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { ICategoryRepository } from '../../domain/ports/category.repository.interface';
import { CategoryModel } from '../../domain/models/category.model';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class CategoryDbRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findById(id: string): Promise<CategoryModel | null> {
    const entity = await this.categoryRepository.findOne({ where: { id } });
    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async findByTransactionType(transactionTypeId: string): Promise<CategoryModel[]> {
    const entities = await this.categoryRepository.find({
      where: { transactionTypeId }
    });
    return entities.map(entity => CategoryMapper.toDomain(entity));
  }
}

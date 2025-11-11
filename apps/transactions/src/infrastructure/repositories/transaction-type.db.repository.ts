import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionTypeEntity } from '../entities/transaction-type.entity';
import { ITransactionTypeRepository } from '../../domain/ports/transaction-type.repository.interface';
import { TransactionTypeModel } from '../../domain/models/transaction-type.model';
import { TransactionTypeMapper } from '../mappers/transaction-type.mapper';

@Injectable()
export class TransactionTypeDbRepository implements ITransactionTypeRepository {
  constructor(
    @InjectRepository(TransactionTypeEntity)
    private readonly transactionTypeRepository: Repository<TransactionTypeEntity>,
  ) {}

  async findById(id: string): Promise<TransactionTypeModel | null> {
    const entity = await this.transactionTypeRepository.findOne({ where: { id } });
    return entity ? TransactionTypeMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<TransactionTypeModel[]> {
    const entities = await this.transactionTypeRepository.find();
    return entities.map(entity => TransactionTypeMapper.toDomain(entity));
  }
}

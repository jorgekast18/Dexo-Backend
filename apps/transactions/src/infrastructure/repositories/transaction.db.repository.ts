import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { ITransactionRepository } from '../../domain/ports/transaction.repository.interface';
import { TransactionModel } from '../../domain/models/transaction.model';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class TransactionDbRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(transaction: TransactionModel): Promise<TransactionModel> {
    const transactionEntity = TransactionMapper.toEntity(transaction);
    const savedEntity = await this.transactionRepository.save(transactionEntity);
    return TransactionMapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<TransactionModel | null> {
    const entity = await this.transactionRepository.findOne({ where: { id } });
    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async findAll(userId: string): Promise<TransactionModel[]> {
    const entities = await this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    return entities.map(entity => TransactionMapper.toDomain(entity));
  }

  async update(id: string, transaction: Partial<TransactionModel>): Promise<TransactionModel> {
    await this.transactionRepository.update(id, transaction);
    const updatedEntity = await this.transactionRepository.findOne({ where: { id } });
    return TransactionMapper.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}

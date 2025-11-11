import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../domain/ports/transaction.repository.interface';
import { TransactionModel } from '../domain/models/transaction.model';

@Injectable()
export class GetAllTransactionsUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(userId: string): Promise<TransactionModel[]> {
    return await this.transactionRepository.findAll(userId);
  }
}

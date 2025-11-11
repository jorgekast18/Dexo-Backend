import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITransactionRepository } from '../domain/ports/transaction.repository.interface';
import { TransactionModel } from '../domain/models/transaction.model';

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(id: string): Promise<TransactionModel> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    return transaction;
  }
}

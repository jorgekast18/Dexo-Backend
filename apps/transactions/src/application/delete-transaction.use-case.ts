import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITransactionRepository } from '../domain/ports/transaction.repository.interface';

@Injectable()
export class DeleteTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // Verificar que la transacción existe antes de eliminar
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    // Eliminar la transacción
    await this.transactionRepository.delete(id);
  }
}

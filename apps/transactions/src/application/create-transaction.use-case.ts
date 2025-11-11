import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ITransactionRepository } from '../domain/ports/transaction.repository.interface';
import { ITransactionTypeRepository } from '../domain/ports/transaction-type.repository.interface';
import { ICategoryRepository } from '../domain/ports/category.repository.interface';
import { TransactionModel } from '../domain/models/transaction.model';

export class CreateTransactionUseCaseDto {
  userId: string;
  transactionTypeId: string;
  categoryId: string;
  amount: number;
  description?: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('ITransactionTypeRepository')
    private readonly transactionTypeRepository: ITransactionTypeRepository,
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(dto: CreateTransactionUseCaseDto): Promise<TransactionModel> {
    // Validar que el tipo de transacción existe
    const transactionType = await this.transactionTypeRepository.findById(dto.transactionTypeId);
    if (!transactionType) {
      throw new NotFoundException('Tipo de transacción no encontrado');
    }

    // Validar que la categoría existe
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    // Validar que la categoría pertenece al tipo de transacción
    if (category.transactionTypeId !== dto.transactionTypeId) {
      throw new BadRequestException(
        'La categoría no corresponde al tipo de transacción seleccionado'
      );
    }

    // Crear el modelo de transacción
    const transaction = TransactionModel.createTransaction(
      dto.userId,
      dto.transactionTypeId,
      dto.categoryId,
      dto.amount,
      dto.description,
    );

    // Guardar en el repositorio
    return await this.transactionRepository.create(transaction);
  }
}

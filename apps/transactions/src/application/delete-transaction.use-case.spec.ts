import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTransactionUseCase } from './delete-transaction.use-case';
import { ITransactionRepository } from '../domain/ports/transaction.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { TransactionModel } from '../domain/models/transaction.model';

describe('DeleteTransactionUseCase', () => {
  let useCase: DeleteTransactionUseCase;
  let  transactionRepository: ITransactionRepository;

  const mockTransactionRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTransactionUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteTransactionUseCase>(DeleteTransactionUseCase);
    transactionRepository = module.get<ITransactionRepository>('ITransactionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should delete a transaction successfully', async () => {
    const mockTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-comida',
      50.00,
      'Almuerzo',
      new Date(),
      new Date(),
    );

    mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
    mockTransactionRepository.delete.mockResolvedValue(undefined);

    await useCase.execute('transaction-123');

    expect(mockTransactionRepository.findById).toHaveBeenCalledWith('transaction-123');
    expect(mockTransactionRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockTransactionRepository.delete).toHaveBeenCalledWith('transaction-123');
    expect(mockTransactionRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when transaction does not exist', async () => {
    mockTransactionRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(
      'Transacción con ID non-existent-id no encontrada'
    );

    expect(mockTransactionRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(mockTransactionRepository.delete).not.toHaveBeenCalled();
  });

  it('should verify transaction exists before attempting delete', async () => {
    const mockTransaction = new TransactionModel(
      'transaction-456',
      'user-456',
      'type-ingreso',
      'category-salario',
      2500.00,
      'Salario mensual',
    );

    mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
    mockTransactionRepository.delete.mockResolvedValue(undefined);

    await useCase.execute('transaction-456');

    // Verificar que findById se llamó primero
    expect(mockTransactionRepository.findById).toHaveBeenCalled();
  });

  it('should handle deletion of transaction without description', async () => {
    const mockTransaction = new TransactionModel(
      'transaction-789',
      'user-789',
      'type-salida',
      'category-transporte',
      30.00,
    );

    mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
    mockTransactionRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute('transaction-789')).resolves.toBeUndefined();
    expect(mockTransactionRepository.delete).toHaveBeenCalledWith('transaction-789');
  });

  it('should return void on successful deletion', async () => {
    const mockTransaction = new TransactionModel(
      'transaction-999',
      'user-999',
      'type-salida',
      'category-comida',
      75.00,
    );

    mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
    mockTransactionRepository.delete.mockResolvedValue(undefined);

    const result = await useCase.execute('transaction-999');

    expect(result).toBeUndefined();
  });
});

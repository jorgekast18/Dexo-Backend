import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionByIdUseCase } from './get-transaction-by-id.use-case';
import { ITransactionRepository } from '../domain/ports/transaction.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { TransactionModel } from '../domain/models/transaction.model';

describe('GetTransactionByIdUseCase', () => {
  let useCase: GetTransactionByIdUseCase;
  let transactionRepository: ITransactionRepository;

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
        GetTransactionByIdUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetTransactionByIdUseCase>(GetTransactionByIdUseCase);
    transactionRepository = module.get<ITransactionRepository>('ITransactionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a transaction when found', async () => {
    const mockTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-123',
      'category-123',
      100.50,
      'Test transaction',
      new Date('2025-11-10'),
      new Date('2025-11-10'),
    );

    mockTransactionRepository.findById.mockResolvedValue(mockTransaction);

    const result = await useCase.execute('transaction-123');

    expect(result).toBeDefined();
    expect(result.id).toBe('transaction-123');
    expect(result.amount).toBe(100.50);
    expect(mockTransactionRepository.findById).toHaveBeenCalledWith('transaction-123');
    expect(mockTransactionRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when transaction is not found', async () => {
    mockTransactionRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(
      'Transacción con ID non-existent-id no encontrada'
    );
    expect(mockTransactionRepository.findById).toHaveBeenCalledWith('non-existent-id');
  });

  it('should return transaction with all fields populated', async () => {
    const createdAt = new Date('2025-11-01T10:00:00Z');
    const updatedAt = new Date('2025-11-10T15:30:00Z');

    const mockTransaction = new TransactionModel(
      'transaction-456',
      'user-456',
      'type-ingreso',
      'category-salario',
      2500.00,
      'Pago de salario mensual',
      createdAt,
      updatedAt,
    );

    mockTransactionRepository.findById.mockResolvedValue(mockTransaction);

    const result = await useCase.execute('transaction-456');

    expect(result.id).toBe('transaction-456');
    expect(result.userId).toBe('user-456');
    expect(result.transactionTypeId).toBe('type-ingreso');
    expect(result.categoryId).toBe('category-salario');
    expect(result.amount).toBe(2500.00);
    expect(result.description).toBe('Pago de salario mensual');
    expect(result.createdAt).toEqual(createdAt);
    expect(result.updatedAt).toEqual(updatedAt);
  });
});

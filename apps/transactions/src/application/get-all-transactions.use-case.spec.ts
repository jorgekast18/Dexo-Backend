import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTransactionsUseCase } from './get-all-transactions.use-case';
import { ITransactionRepository } from '../domain/ports/transaction.repository.interface';
import { TransactionModel } from '../domain/models/transaction.model';

describe('GetAllTransactionsUseCase', () => {
  let useCase: GetAllTransactionsUseCase;
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
        GetAllTransactionsUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllTransactionsUseCase>(GetAllTransactionsUseCase);
    transactionRepository = module.get<ITransactionRepository>('ITransactionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all transactions for a user', async () => {
    const mockTransactions = [
      new TransactionModel(
        'transaction-1',
        'user-123',
        'type-ingreso',
        'category-salario',
        2500.00,
        'Salario mensual',
        new Date('2025-11-01'),
        new Date('2025-11-01'),
      ),
      new TransactionModel(
        'transaction-2',
        'user-123',
        'type-salida',
        'category-comida',
        50.00,
        'Almuerzo',
        new Date('2025-11-05'),
        new Date('2025-11-05'),
      ),
      new TransactionModel(
        'transaction-3',
        'user-123',
        'type-salida',
        'category-transporte',
        30.00,
        'Taxi',
        new Date('2025-11-10'),
        new Date('2025-11-10'),
      ),
    ];

    mockTransactionRepository.findAll.mockResolvedValue(mockTransactions);

    const result = await useCase.execute('user-123');

    expect(result).toBeDefined();
    expect(result).toHaveLength(3);
    expect(result[0].userId).toBe('user-123');
    expect(result[1].userId).toBe('user-123');
    expect(result[2].userId).toBe('user-123');
    expect(mockTransactionRepository.findAll).toHaveBeenCalledWith('user-123');
    expect(mockTransactionRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when user has no transactions', async () => {
    mockTransactionRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute('user-without-transactions');

    expect(result).toBeDefined();
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
    expect(mockTransactionRepository.findAll).toHaveBeenCalledWith('user-without-transactions');
  });

  it('should return transactions ordered by creation date descending', async () => {
    const mockTransactions = [
      new TransactionModel(
        'transaction-3',
        'user-456',
        'type-salida',
        'category-transporte',
        30.00,
        'Más reciente',
        new Date('2025-11-10'),
        new Date('2025-11-10'),
      ),
      new TransactionModel(
        'transaction-2',
        'user-456',
        'type-salida',
        'category-comida',
        50.00,
        'Medio',
        new Date('2025-11-05'),
        new Date('2025-11-05'),
      ),
      new TransactionModel(
        'transaction-1',
        'user-456',
        'type-ingreso',
        'category-salario',
        2500.00,
        'Más antigua',
        new Date('2025-11-01'),
        new Date('2025-11-01'),
      ),
    ];

    mockTransactionRepository.findAll.mockResolvedValue(mockTransactions);

    const result = await useCase.execute('user-456');

    expect(result).toHaveLength(3);
    expect(result[0].description).toBe('Más reciente');
    expect(result[2].description).toBe('Más antigua');
  });
});

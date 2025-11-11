import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { CreateTransactionUseCase } from '../application/create-transaction.use-case';
import { GetTransactionByIdUseCase } from '../application/get-transaction-by-id.use-case';
import { GetAllTransactionsUseCase } from '../application/get-all-transactions.use-case';
import { UpdateTransactionUseCase } from '../application/update-transaction.use-case';
import { DeleteTransactionUseCase } from '../application/delete-transaction.use-case';
import { TransactionModel } from '../domain/models/transaction.model';

describe('TransactionController', () => {
  let controller: TransactionController;
  let createTransactionUseCase: CreateTransactionUseCase;
  let getTransactionByIdUseCase: GetTransactionByIdUseCase;
  let getAllTransactionsUseCase: GetAllTransactionsUseCase;
  let updateTransactionUseCase: UpdateTransactionUseCase;
  let deleteTransactionUseCase: DeleteTransactionUseCase;

  const mockCreateTransactionUseCase = {
    execute: jest.fn(),
  };

  const mockGetTransactionByIdUseCase = {
    execute: jest.fn(),
  };

  const mockGetAllTransactionsUseCase = {
    execute: jest.fn(),
  };

  const mockUpdateTransactionUseCase = {
    execute: jest.fn(),
  };

  const mockDeleteTransactionUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: CreateTransactionUseCase,
          useValue: mockCreateTransactionUseCase,
        },
        {
          provide: GetTransactionByIdUseCase,
          useValue: mockGetTransactionByIdUseCase,
        },
        {
          provide: GetAllTransactionsUseCase,
          useValue: mockGetAllTransactionsUseCase,
        },
        {
          provide: UpdateTransactionUseCase,
          useValue: mockUpdateTransactionUseCase,
        },
        {
          provide: DeleteTransactionUseCase,
          useValue: mockDeleteTransactionUseCase,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    createTransactionUseCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    getTransactionByIdUseCase = module.get<GetTransactionByIdUseCase>(GetTransactionByIdUseCase);
    getAllTransactionsUseCase = module.get<GetAllTransactionsUseCase>(GetAllTransactionsUseCase);
    updateTransactionUseCase = module.get<UpdateTransactionUseCase>(UpdateTransactionUseCase);
    deleteTransactionUseCase = module.get<DeleteTransactionUseCase>(DeleteTransactionUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createDto = {
        userId: 'user-123',
        transactionTypeId: 'type-ingreso',
        categoryId: 'category-salario',
        amount: 2500.00,
        description: 'Salario mensual',
      };

      const mockCreatedTransaction = new TransactionModel(
        'transaction-123',
        createDto.userId,
        createDto.transactionTypeId,
        createDto.categoryId,
        createDto.amount,
        createDto.description,
      );

      mockCreateTransactionUseCase.execute.mockResolvedValue(mockCreatedTransaction);

      const result = await controller.create(createDto);

      expect(result).toBeDefined();
      expect(mockCreateTransactionUseCase.execute).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const mockTransaction = new TransactionModel(
        'transaction-123',
        'user-123',
        'type-123',
        'category-123',
        100.50,
        'Test transaction',
      );

      mockGetTransactionByIdUseCase.execute.mockResolvedValue(mockTransaction);

      const result = await controller.findOne('transaction-123');

      expect(result).toBeDefined();
      expect(result.id).toBe('transaction-123');
      expect(mockGetTransactionByIdUseCase.execute).toHaveBeenCalledWith('transaction-123');
    });
  });

  describe('findAll', () => {
    it('should return all transactions for a user', async () => {
      const mockTransactions = [
        new TransactionModel(
          'transaction-1',
          'user-123',
          'type-ingreso',
          'category-salario',
          2500.00,
        ),
        new TransactionModel(
          'transaction-2',
          'user-123',
          'type-salida',
          'category-comida',
          50.00,
        ),
      ];

      mockGetAllTransactionsUseCase.execute.mockResolvedValue(mockTransactions);

      const result = await controller.findAll('user-123');

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(mockGetAllTransactionsUseCase.execute).toHaveBeenCalledWith('user-123');
    });

    it('should return empty array when no transactions found', async () => {
      mockGetAllTransactionsUseCase.execute.mockResolvedValue([]);

      const result = await controller.findAll('user-without-transactions');

      expect(result).toEqual([]);
      expect(mockGetAllTransactionsUseCase.execute).toHaveBeenCalledWith('user-without-transactions');
    });
  });

  describe('update', () => {
    it('should update a transaction successfully', async () => {
      const updateDto = {
        amount: 150.00,
        description: 'Updated description',
      };

      const updatedTransaction = new TransactionModel(
        'transaction-123',
        'user-123',
        'type-salida',
        'category-comida',
        150.00,
        'Updated description',
      );

      mockUpdateTransactionUseCase.execute.mockResolvedValue(updatedTransaction);

      const result = await controller.update('transaction-123', updateDto);

      expect(result).toBeDefined();
      expect(result.amount).toBe(150.00);
      expect(result.description).toBe('Updated description');
      expect(mockUpdateTransactionUseCase.execute).toHaveBeenCalledWith(
        'transaction-123',
        updateDto
      );
    });

    it('should update only amount', async () => {
      const updateDto = { amount: 200.00 };

      const updatedTransaction = new TransactionModel(
        'transaction-123',
        'user-123',
        'type-ingreso',
        'category-salario',
        200.00,
        'Original description',
      );

      mockUpdateTransactionUseCase.execute.mockResolvedValue(updatedTransaction);

      const result = await controller.update('transaction-123', updateDto);

      expect(result.amount).toBe(200.00);
      expect(mockUpdateTransactionUseCase.execute).toHaveBeenCalledWith(
        'transaction-123',
        updateDto
      );
    });
  });

  describe('delete', () => {
    it('should delete a transaction successfully', async () => {
      mockDeleteTransactionUseCase.execute.mockResolvedValue(undefined);

      const result = await controller.delete('transaction-123');

      expect(result).toBeUndefined();
      expect(mockDeleteTransactionUseCase.execute).toHaveBeenCalledWith('transaction-123');
      expect(mockDeleteTransactionUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should call delete use case with correct id', async () => {
      mockDeleteTransactionUseCase.execute.mockResolvedValue(undefined);

      await controller.delete('transaction-to-delete');

      expect(mockDeleteTransactionUseCase.execute).toHaveBeenCalledWith('transaction-to-delete');
    });

    it('should return void after successful deletion', async () => {
      mockDeleteTransactionUseCase.execute.mockResolvedValue(undefined);

      const result = await controller.delete('transaction-999');

      expect(result).toBeUndefined();
    });
  });
});

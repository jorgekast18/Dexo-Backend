import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTransactionUseCase } from './update-transaction.use-case';
import { ITransactionRepository } from '../domain/ports/transaction.repository.interface';
import { ITransactionTypeRepository } from '../domain/ports/transaction-type.repository.interface';
import { ICategoryRepository } from '../domain/ports/category.repository.interface';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionModel } from '../domain/models/transaction.model';
import { TransactionTypeModel } from '../domain/models/transaction-type.model';
import { CategoryModel } from '../domain/models/category.model';

describe('UpdateTransactionUseCase', () => {
  let useCase: UpdateTransactionUseCase;
  let transactionRepository: ITransactionRepository;
  let transactionTypeRepository: ITransactionTypeRepository;
  let categoryRepository: ICategoryRepository;

  const mockTransactionRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockTransactionTypeRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
  };

  const mockCategoryRepository = {
    findById: jest.fn(),
    findByTransactionType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTransactionUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: mockTransactionRepository,
        },
        {
          provide: 'ITransactionTypeRepository',
          useValue: mockTransactionTypeRepository,
        },
        {
          provide: 'ICategoryRepository',
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateTransactionUseCase>(UpdateTransactionUseCase);
    transactionRepository = module.get<ITransactionRepository>('ITransactionRepository');
    transactionTypeRepository = module.get<ITransactionTypeRepository>('ITransactionTypeRepository');
    categoryRepository = module.get<ICategoryRepository>('ICategoryRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should update transaction amount successfully', async () => {
    const existingTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-ingreso',
      'category-salario',
      1000.00,
      'Salario antiguo',
    );

    const updatedTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-ingreso',
      'category-salario',
      2500.00,
      'Salario antiguo',
    );

    mockTransactionRepository.findById.mockResolvedValue(existingTransaction);
    mockTransactionRepository.update.mockResolvedValue(updatedTransaction);

    const result = await useCase.execute('transaction-123', { amount: 2500.00 });

    expect(result.amount).toBe(2500.00);
    expect(mockTransactionRepository.findById).toHaveBeenCalledWith('transaction-123');
    expect(mockTransactionRepository.update).toHaveBeenCalledWith('transaction-123', {
      amount: 2500.00
    });
  });

  it('should update transaction description successfully', async () => {
    const existingTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-comida',
      50.00,
      'Descripción antigua',
    );

    const updatedTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-comida',
      50.00,
      'Nueva descripción',
    );

    mockTransactionRepository.findById.mockResolvedValue(existingTransaction);
    mockTransactionRepository.update.mockResolvedValue(updatedTransaction);

    const result = await useCase.execute('transaction-123', {
      description: 'Nueva descripción'
    });

    expect(result.description).toBe('Nueva descripción');
  });

  it('should throw NotFoundException when transaction does not exist', async () => {
    mockTransactionRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('non-existent-id', { amount: 100 })
    ).rejects.toThrow(NotFoundException);

    await expect(
      useCase.execute('non-existent-id', { amount: 100 })
    ).rejects.toThrow('Transacción con ID non-existent-id no encontrada');
  });

  it('should update category when valid', async () => {
    const existingTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-comida',
      50.00,
    );

    const newCategory = new CategoryModel(
      'category-transporte',
      'Transporte',
      'type-salida',
    );

    const updatedTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-transporte',
      50.00,
    );

    mockTransactionRepository.findById.mockResolvedValue(existingTransaction);
    mockCategoryRepository.findById.mockResolvedValue(newCategory);
    mockTransactionRepository.update.mockResolvedValue(updatedTransaction);

    const result = await useCase.execute('transaction-123', {
      categoryId: 'category-transporte'
    });

    expect(result.categoryId).toBe('category-transporte');
    expect(mockCategoryRepository.findById).toHaveBeenCalledWith('category-transporte');
  });

  it('should throw NotFoundException when category does not exist', async () => {
    const existingTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-comida',
      50.00,
    );

    mockTransactionRepository.findById.mockResolvedValue(existingTransaction);
    mockCategoryRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('transaction-123', { categoryId: 'invalid-category' })
    ).rejects.toThrow(NotFoundException);

    await expect(
      useCase.execute('transaction-123', { categoryId: 'invalid-category' })
    ).rejects.toThrow('Categoría no encontrada');
  });

  it('should throw BadRequestException when category does not match transaction type', async () => {
    const existingTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-comida',
      50.00,
    );

    const incompatibleCategory = new CategoryModel(
      'category-salario',
      'Salario',
      'type-ingreso', // Tipo diferente
    );

    mockTransactionRepository.findById.mockResolvedValue(existingTransaction);
    mockCategoryRepository.findById.mockResolvedValue(incompatibleCategory);

    await expect(
      useCase.execute('transaction-123', { categoryId: 'category-salario' })
    ).rejects.toThrow(BadRequestException);

    await expect(
      useCase.execute('transaction-123', { categoryId: 'category-salario' })
    ).rejects.toThrow('La categoría no corresponde al tipo de transacción');
  });

  it('should update both transaction type and category when compatible', async () => {
    const existingTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-comida',
      50.00,
    );

    const newTransactionType = new TransactionTypeModel(
      'type-ingreso',
      'ingreso',
    );

    const newCategory = new CategoryModel(
      'category-salario',
      'Salario',
      'type-ingreso',
    );

    const updatedTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-ingreso',
      'category-salario',
      50.00,
    );

    mockTransactionRepository.findById.mockResolvedValue(existingTransaction);
    mockTransactionTypeRepository.findById.mockResolvedValue(newTransactionType);
    mockCategoryRepository.findById.mockResolvedValue(newCategory);
    mockTransactionRepository.update.mockResolvedValue(updatedTransaction);

    const result = await useCase.execute('transaction-123', {
      transactionTypeId: 'type-ingreso',
      categoryId: 'category-salario',
    });

    expect(result.transactionTypeId).toBe('type-ingreso');
    expect(result.categoryId).toBe('category-salario');
  });

  it('should throw BadRequestException when updating type without updating incompatible category', async () => {
    const existingTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-comida',
      50.00,
    );

    const newTransactionType = new TransactionTypeModel(
      'type-ingreso',
      'ingreso',
    );

    const currentCategory = new CategoryModel(
      'category-comida',
      'Comida',
      'type-salida', // Incompatible con el nuevo tipo
    );

    mockTransactionRepository.findById.mockResolvedValue(existingTransaction);
    mockTransactionTypeRepository.findById.mockResolvedValue(newTransactionType);
    mockCategoryRepository.findById.mockResolvedValue(currentCategory);

    await expect(
      useCase.execute('transaction-123', { transactionTypeId: 'type-ingreso' })
    ).rejects.toThrow(BadRequestException);

    await expect(
      useCase.execute('transaction-123', { transactionTypeId: 'type-ingreso' })
    ).rejects.toThrow(
      'La categoría actual no es compatible con el nuevo tipo de transacción. ' +
      'Debe actualizar también la categoría'
    );
  });

  it('should update multiple fields at once', async () => {
    const existingTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-comida',
      50.00,
      'Descripción antigua',
    );

    const updatedTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-comida',
      75.50,
      'Nueva descripción',
    );

    mockTransactionRepository.findById.mockResolvedValue(existingTransaction);
    mockTransactionRepository.update.mockResolvedValue(updatedTransaction);

    const result = await useCase.execute('transaction-123', {
      amount: 75.50,
      description: 'Nueva descripción',
    });

    expect(result.amount).toBe(75.50);
    expect(result.description).toBe('Nueva descripción');
    expect(mockTransactionRepository.update).toHaveBeenCalledWith('transaction-123', {
      amount: 75.50,
      description: 'Nueva descripción',
    });
  });

  it('should throw NotFoundException when transaction type does not exist', async () => {
    const existingTransaction = new TransactionModel(
      'transaction-123',
      'user-123',
      'type-salida',
      'category-comida',
      50.00,
    );

    mockTransactionRepository.findById.mockResolvedValue(existingTransaction);
    mockTransactionTypeRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('transaction-123', { transactionTypeId: 'invalid-type' })
    ).rejects.toThrow(NotFoundException);

    await expect(
      useCase.execute('transaction-123', { transactionTypeId: 'invalid-type' })
    ).rejects.toThrow('Tipo de transacción no encontrado');
  });
});

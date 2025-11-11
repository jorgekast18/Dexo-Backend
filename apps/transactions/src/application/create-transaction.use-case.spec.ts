import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { ITransactionRepository } from '../domain/ports/transaction.repository.interface';
import { ITransactionTypeRepository } from '../domain/ports/transaction-type.repository.interface';
import { ICategoryRepository } from '../domain/ports/category.repository.interface';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionModel } from '../domain/models/transaction.model';
import { TransactionTypeModel } from '../domain/models/transaction-type.model';
import { CategoryModel } from '../domain/models/category.model';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
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
        CreateTransactionUseCase,
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

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
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

  it('should create a transaction successfully', async () => {
    const dto = {
      userId: 'user-123',
      transactionTypeId: 'type-123',
      categoryId: 'category-123',
      amount: 100.50,
      description: 'Test transaction',
    };

    const mockTransactionType = new TransactionTypeModel(
      'type-123',
      'ingreso',
      'Ingresos'
    );

    const mockCategory = new CategoryModel(
      'category-123',
      'Salario',
      'type-123',
      'Salario mensual'
    );

    const mockCreatedTransaction = new TransactionModel(
      'transaction-123',
      dto.userId,
      dto.transactionTypeId,
      dto.categoryId,
      dto.amount,
      dto.description,
      new Date(),
      new Date(),
    );

    mockTransactionTypeRepository.findById.mockResolvedValue(mockTransactionType);
    mockCategoryRepository.findById.mockResolvedValue(mockCategory);
    mockTransactionRepository.create.mockResolvedValue(mockCreatedTransaction);

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.userId).toBe(dto.userId);
    expect(result.amount).toBe(dto.amount);
    expect(mockTransactionTypeRepository.findById).toHaveBeenCalledWith(dto.transactionTypeId);
    expect(mockCategoryRepository.findById).toHaveBeenCalledWith(dto.categoryId);
    expect(mockTransactionRepository.create).toHaveBeenCalled();
  });

  it('should throw NotFoundException when transaction type does not exist', async () => {
    const dto = {
      userId: 'user-123',
      transactionTypeId: 'invalid-type',
      categoryId: 'category-123',
      amount: 100.50,
    };

    mockTransactionTypeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(dto)).rejects.toThrow('Tipo de transacción no encontrado');
  });

  it('should throw NotFoundException when category does not exist', async () => {
    const dto = {
      userId: 'user-123',
      transactionTypeId: 'type-123',
      categoryId: 'invalid-category',
      amount: 100.50,
    };

    const mockTransactionType = new TransactionTypeModel(
      'type-123',
      'ingreso',
      'Ingresos'
    );

    mockTransactionTypeRepository.findById.mockResolvedValue(mockTransactionType);
    mockCategoryRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(dto)).rejects.toThrow('Categoría no encontrada');
  });

  it('should throw BadRequestException when category does not match transaction type', async () => {
    const dto = {
      userId: 'user-123',
      transactionTypeId: 'type-ingreso',
      categoryId: 'category-123',
      amount: 100.50,
    };

    const mockTransactionType = new TransactionTypeModel(
      'type-ingreso',
      'ingreso',
      'Ingresos'
    );

    const mockCategory = new CategoryModel(
      'category-123',
      'Transporte',
      'type-salida', // Diferente tipo
      'Gastos de transporte'
    );

    mockTransactionTypeRepository.findById.mockResolvedValue(mockTransactionType);
    mockCategoryRepository.findById.mockResolvedValue(mockCategory);

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
    await expect(useCase.execute(dto)).rejects.toThrow(
      'La categoría no corresponde al tipo de transacción seleccionado'
    );
  });

  it('should create transaction without description', async () => {
    const dto = {
      userId: 'user-123',
      transactionTypeId: 'type-123',
      categoryId: 'category-123',
      amount: 50.00,
    };

    const mockTransactionType = new TransactionTypeModel('type-123', 'salida', 'Salidas');
    const mockCategory = new CategoryModel('category-123', 'Comida', 'type-123');

    const mockCreatedTransaction = new TransactionModel(
      'transaction-123',
      dto.userId,
      dto.transactionTypeId,
      dto.categoryId,
      dto.amount,
    );

    mockTransactionTypeRepository.findById.mockResolvedValue(mockTransactionType);
    mockCategoryRepository.findById.mockResolvedValue(mockCategory);
    mockTransactionRepository.create.mockResolvedValue(mockCreatedTransaction);

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.description).toBeUndefined();
  });
});

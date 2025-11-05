import { Test, TestingModule } from '@nestjs/testing';
import { SignupUseCase } from '../application/signup.use-case';
import { UserRepositoryInterface } from '../domain/ports/user.repository.interface'
import { User } from '../domain/models/user.model';

describe('SignupUseCase', () => {
  let useCase: SignupUseCase;
  let usersRepoMock: Partial<UserRepositoryInterface>;

  beforeEach(async () => {
    usersRepoMock = {
      // Simula solamente el método save
      save: jest.fn().mockImplementation(async (user: User) => {
        return { ...user, id: 'generated-id' };
      }),
      findByEmail: jest.fn().mockResolvedValue(null), // puede ser útil para validaciones
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignupUseCase,
        { provide: 'IUserRepository', useValue: usersRepoMock },
      ],
    }).compile();

    useCase = module.get<SignupUseCase>(SignupUseCase);
  });

  it('should create and return a new user with generated id', async () => {
    const inputData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'supersecret',
      age: 24,
      gender: 'male',
    };

    const result = await useCase.execute(inputData);

    expect(usersRepoMock.save).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.email).toBe(inputData.email);
    expect(result.name).toBe(inputData.name);
    expect(result.age).toBe(inputData.age);
    expect(result.gender).toBe(inputData.gender);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../infrastructure/repositories/user.db.repository';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { User } from '../../domain/models/user.model';
import { Repository } from 'typeorm';

describe('UserRepository', () => {
  let repository: UserRepository;
  let ormRepoMock: Partial<Repository<UserEntity>>;

  beforeEach(async () => {
    // Mock del repositorio TypeORM
    ormRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: 'UserEntityRepository',
          useValue: ormRepoMock,
        },
      ],
    })
      .overrideProvider('UserEntityRepository')
      .useValue(ormRepoMock)
      .compile();

    repository = module.get(UserRepository);
  });

  it('save() debería mapear y persistir correctamente un usuario', async () => {
    const entityMock = {
      id: 'uuid-123',
      name: 'Jane',
      email: 'jane@email.com',
      age: 24,
      gender: 'female',
      password: 'hashedpass',
    };

    jest.spyOn(ormRepoMock, 'create').mockReturnValue(entityMock as any);
    jest.spyOn(ormRepoMock, 'save').mockResolvedValue(entityMock as any);

    const user = new User('Jane', 'jane@email.com', 24, 'female', 'password123');

    const result = await repository.save(user);

    expect(ormRepoMock.create).toHaveBeenCalled();
    expect(result).toBeInstanceOf(User);
    expect(result.email).toBe('jane@email.com');
    expect(result.name).toBe('Jane');
    expect(result.age).toBe(24);
    expect(result.gender).toBe('female');
  });
});

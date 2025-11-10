import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.use-case';
import { UserRepositoryInterface } from '../domain/ports/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: UserRepositoryInterface;
  let jwtService: JwtService;

  const mockUserRepository = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    userRepository = module.get<UserRepositoryInterface>('IUserRepository');
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return access token when credentials are valid', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockJwtService.sign.mockReturnValue('mock-jwt-token');

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual({ access_token: 'mock-jwt-token' });
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should throw UnauthorizedException when user not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'notfound@example.com',
        password: 'password123',
      })
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    const hashedPassword = await bcrypt.hash('correctPassword', 10);
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(
      useCase.execute({
        email: 'test@example.com',
        password: 'wrongPassword',
      })
    ).rejects.toThrow(UnauthorizedException);
  });
});

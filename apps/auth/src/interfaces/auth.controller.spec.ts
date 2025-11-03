import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { SignupUseCase } from '../application/signup.use-case';

describe('AuthController', () => {
  let controller: AuthController;
  let signupMock: jest.Mock;

  beforeEach(async () => {
    signupMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: SignupUseCase, useValue: { execute: signupMock } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should signup user successfully', async () => {
    signupMock.mockResolvedValue({ id: 'uid', name: 'John', email: 'john@mail.com' });
    const res = await controller.signup({
      name: 'John', email: 'john@mail.com', age: 24, gender: 'male', password: 'secret'
    });
    expect(res).toEqual({ id: 'uid', name: 'John', email: 'john@mail.com' });
  });
});

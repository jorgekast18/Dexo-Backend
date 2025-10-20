import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../users/user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('Must be create new user', () => {
    const user = service.create({
      name: 'Juan',
      email: 'juan@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('juan@example.com');
  });
});

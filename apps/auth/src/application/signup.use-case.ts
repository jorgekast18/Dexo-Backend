import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepositoryInterface } from '../domain/ports/user.repository.interface';
import { User } from '../domain/models/user.model';

@Injectable()
export class SignupUseCase {
  constructor(
    @Inject('IUserRepository')
    private userRepo: UserRepositoryInterface
  ) {}

  async execute(data: Partial<User>): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const userToCreate: User = User.createUser(
      data.name,
      data.email,
      data.age,
      data.gender,
      passwordHash
    )

    return await this.userRepo.save(userToCreate);
  }
}

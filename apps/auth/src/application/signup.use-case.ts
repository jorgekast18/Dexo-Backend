import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

interface SignupDto {
  name: string;
  email: string;
  age: number;
  gender: string;
  password: string;
}

@Injectable()
export class SignupUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(data: SignupDto): Promise<User> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new Error('Email already exists');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = new User(uuidv4(), data.name, data.email, data.age, data.gender, passwordHash);
    await this.userRepo.save(user);
    return user;
  }
}

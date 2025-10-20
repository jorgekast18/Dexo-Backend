import { Injectable } from '@nestjs/common';
import { uuid } from 'uuidv4';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  private users: User[] = [];

  create(dto: CreateUserDto): User {
    const user: User = { id: uuid(), ...dto };
    this.users.push(user);
    return user;
  }
}

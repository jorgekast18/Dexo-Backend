import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../../domain/ports/user.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../domain/models/user.model';
import { Repository } from 'typeorm';
import { UserMapper } from '../mappers/user.mapper';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(userData: User): Promise<User> {
    const userEntity: UserEntity = UserMapper.toEntity(userData);
    const entity: UserEntity = this.userRepository.create(userEntity);
    const result: UserEntity = await this.userRepository.save(entity);
    return UserMapper.toDomain(result);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result: UserEntity = await this.userRepository.findOne({ where: { email }});
    return result ? UserMapper.toDomain(result) : null;
  }
}

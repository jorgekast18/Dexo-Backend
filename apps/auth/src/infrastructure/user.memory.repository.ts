import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../domain/ports/user.repository.interface';
import { UserEntity } from './entities/user.entity';
import { User } from '../domain/models/user.model';
import { DataSource, Repository } from 'typeorm';
import { UserMapper } from './mappers/user.mapper';
import { POSTGRES_DATASOURCE } from '../config/database.module';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  private readonly userRepo: Repository<UserEntity>;
  constructor(
    @Inject(POSTGRES_DATASOURCE)
    private readonly dataSource: DataSource,
  ) {
    this.userRepo = this.dataSource.getRepository(UserEntity);
  }

  async save(userData: User): Promise<User> {
    const userEntity: UserEntity = UserMapper.toEntity(userData);
    const entity = this.userRepo.create(userEntity);
    const result = await this.userRepo.save(entity);
    return UserMapper.toDomain(result);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.userRepo.findOne({ where: { email }});
    if (!result) return null;
    return UserMapper.toDomain(result);
  }

}

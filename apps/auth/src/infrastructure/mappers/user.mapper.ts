import { User } from '../../domain/models/user.model';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.name = user.name;
    entity.email = user.email;
    entity.age = user.age;
    entity.gender = user.gender;
    entity.password = user.password;
    return entity;
  }

  static toDomain(entity: UserEntity): User {
    return new User(
      entity.name,
      entity.email,
      entity.age,
      entity.gender,
      entity.password,
      entity.id,
      entity.createdAt,
      entity.updatedAt
    );
  }
}

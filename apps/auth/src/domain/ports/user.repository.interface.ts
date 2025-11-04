import { User } from '../models/user.model';

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

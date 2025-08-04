import { UserEntity } from '../entities/user.entity';
import { UserCreateData, UserFindAllData, UserUpdateData } from '../types';

export abstract class UserRepository {
  abstract create(data: UserCreateData): Promise<UserEntity>;
  abstract update(id: string, data: UserUpdateData): Promise<UserEntity>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByUserName(userName: string): Promise<UserEntity | null>;
  abstract findAll(query: UserFindAllData): Promise<UserEntity[]>;
}

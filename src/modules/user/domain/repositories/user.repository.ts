import { UserCreateInputDto, UserUpdateInputDto } from '../../application/dto';
import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByUserName(userName: string): Promise<UserEntity | null>;
  abstract create(data: UserCreateInputDto): Promise<UserEntity>;
  abstract update(id: string, data: UserUpdateInputDto): Promise<UserEntity>;
}

import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '@modules/user/application/dto/create-user.dto';
import { UpdateUserDto } from '@modules/user/application/dto/update-user.dto';

// Tipos derivados de los DTOs para operaciones de repositorio
export type CreateUserData = Omit<CreateUserDto, 'password'> & { password: string };
export type UpdateUserData = UpdateUserDto;

export abstract class UserRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByUserName(userName: string): Promise<UserEntity | null>;
  abstract create(data: CreateUserData): Promise<UserEntity>;
  abstract update(id: string, data: UpdateUserData): Promise<UserEntity>;
}

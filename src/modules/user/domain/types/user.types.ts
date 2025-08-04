import { UserEntity } from '../entities/user.entity';

export type UserCreateEntity = Pick<UserEntity, 'email' | 'password' | 'userName'>;

export type UserUpdateEntity = Partial<Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>>;

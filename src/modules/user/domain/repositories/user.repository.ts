import { UserEntity } from '../entities/user.entity';

// Domain types for repository methods
export type CreateUserData = {
  email: string;
  userName: string;
  password: string;
  // add other required fields
};

export type UpdateUserData = Partial<{
  email: string;
  userName: string;
  password: string;
  status: string;
  role: string;
  // add other updatable fields
}>;

export type UserQueryParams = Partial<{
  email: string;
  userName: string;
  status: string;
  role: string;
  // add other filter fields
}>;

export abstract class UserRepository {
  abstract create(data: CreateUserData): Promise<UserEntity>;
  abstract update(id: string, data: UpdateUserData): Promise<UserEntity>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByUserName(userName: string): Promise<UserEntity | null>;
  abstract findAll(query: UserQueryParams): Promise<UserEntity[]>;
}

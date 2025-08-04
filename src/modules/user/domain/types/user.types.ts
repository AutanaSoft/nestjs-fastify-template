import { UserRole, UserStatus } from '../enums';

export type UserCreateData = {
  email: string;
  userName: string;
  password: string;
  status?: UserStatus;
  role?: UserRole;
};

export type UserUpdateData = Partial<UserCreateData>;

export type UserPaginateData = {
  page: number;
  limit: number;
  sortBy?: 'email' | 'userName' | 'status' | 'role' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

export type UserFindAllData = {
  email?: string;
  username?: string;
  status?: UserStatus;
  role?: UserRole;
  createdAt?: Date;
};

export type UserFindAllPaginateData = UserPaginateData & UserFindAllData;

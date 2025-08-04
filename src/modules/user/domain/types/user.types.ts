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
  userName?: string;
  status?: UserStatus;
  role?: UserRole;
  createdAtFrom?: Date;
  createdAtTo?: Date;
};

export type UserFindAllPaginateData = UserPaginateData & UserFindAllData;

import { SortOrder, UserRole, UserSortBy, UserStatus } from '../enums';

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
};

export type UserFindFilterData = {
  email?: string;
  userName?: string;
  status?: UserStatus;
  role?: UserRole;
  createdAtFrom?: Date;
  createdAtTo?: Date;
};

export type UserSortOrderData = {
  sortBy?: UserSortBy;
  sortOrder?: SortOrder;
};

export type UserFindAllData = {
  filter?: UserFindFilterData;
  sort?: UserSortOrderData;
};

export type UserFindAllPaginateData = UserPaginateData & UserFindAllData;

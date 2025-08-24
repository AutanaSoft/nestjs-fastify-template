import { SortOrder, UserRole, UserSortBy, UserStatus } from '../enums';

/**
 * Data required to create a new user
 */
export type UserCreateData = {
  /** User's email address - must be unique */
  email: string;
  /** User's display name - must be unique */
  userName: string;
  /** User's password - will be hashed before storage */
  password: string;
  /** User's account status - defaults to ACTIVE */
  status?: UserStatus;
  /** User's role - defaults to USER */
  role?: UserRole;
};

/**
 * Data for updating an existing user
 * All fields are optional since this is used for partial updates
 */
export type UserUpdateData = Partial<UserCreateData>;

/**
 * Pagination parameters for user queries
 */
export type UserPaginateData = {
  /** Page number starting from 1 */
  page: number;
  /** Number of items per page */
  limit: number;
};

/**
 * Filter criteria for finding users
 * All fields are optional and will be combined with AND logic
 */
export type UserFindFilterData = {
  /** Filter by exact email match */
  email?: string;
  /** Filter by exact username match */
  userName?: string;
  /** Filter by user status */
  status?: UserStatus;
  /** Filter by user role */
  role?: UserRole;
  /** Filter users created on or after this date */
  createdAtFrom?: Date;
  /** Filter users created on or before this date */
  createdAtTo?: Date;
};

/**
 * Sorting configuration for user queries
 */
export type UserSortOrderData = {
  /** Field to sort by */
  sortBy?: UserSortBy;
  /** Sort direction - ASC or DESC */
  sortOrder?: SortOrder;
};

/**
 * Combined filter and sort parameters for finding users
 * Used for non-paginated queries
 */
export type UserFindAllData = {
  /** Optional filter criteria */
  filter?: UserFindFilterData;
  /** Optional sort configuration */
  sort?: UserSortOrderData;
};

/**
 * Combined parameters for paginated user queries
 * Includes pagination, filtering, and sorting options
 */
export type UserFindAllPaginateData = UserPaginateData & UserFindAllData;

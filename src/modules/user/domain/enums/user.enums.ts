import { registerEnumType } from '@nestjs/graphql';

/**
 * User roles defining permission levels within the system
 */
export enum UserRole {
  /** Administrator with full system access */
  ADMIN = 'ADMIN',
  /** Regular user with standard permissions */
  USER = 'USER',
}

/**
 * Register GraphQL enum types for user roles
 */
registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User roles defining permission levels within the system',
});

/**
 * User account status indicating the current state of the user account
 */
export enum UserStatus {
  /** User has registered but not yet activated their account */
  REGISTERED = 'REGISTERED',
  /** User account is active and fully functional */
  ACTIVE = 'ACTIVE',
  /** User account has been banned and cannot access the system */
  BANNED = 'BANNED',
  /** User account is temporarily inactive */
  INACTIVE = 'INACTIVE',
}

/**
 * Register GraphQL enum types for user status
 */
registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'User account status indicating the current state of the user account',
});

/**
 * Available fields for sorting user queries
 */
export enum UserSortBy {
  /** Sort by account creation date */
  CREATED_AT = 'createdAt',
  /** Sort by last update date */
  UPDATED_AT = 'updatedAt',
  /** Sort by email address alphabetically */
  EMAIL = 'email',
  /** Sort by username alphabetically */
  USERNAME = 'userName',
}

/**
 * Register GraphQL enum types for user sorting
 */
registerEnumType(UserSortBy, {
  name: 'UserSortBy',
  description: 'Available fields for sorting user queries',
});

/**
 * Sort order direction for database queries
 */
export enum SortOrder {
  /** Ascending order (A-Z, 0-9, oldest first) */
  ASC = 'asc',
  /** Descending order (Z-A, 9-0, newest first) */
  DESC = 'desc',
}

/**
 * Register GraphQL enum types for sorting
 */
registerEnumType(SortOrder, {
  name: 'SortOrder',
  description: 'Sort order direction for database queries',
});

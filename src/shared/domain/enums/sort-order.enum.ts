import { registerEnumType } from '@nestjs/graphql';

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

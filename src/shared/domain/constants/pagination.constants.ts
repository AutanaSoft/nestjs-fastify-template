/**
 * Default pagination limits to prevent excessive resource usage
 */
export const PAGINATION_TAKE_LIMITS = {
  /** Maximum number of items per page */
  MAX_LIMIT: 100,
  /** Default number of items per page */
  DEFAULT_LIMIT: 25,
  /** Minimum number of items per page */
  MIN_LIMIT: 1,
} as const;

/**
 * Type definitions for pagination operations
 * Provides interfaces and types for type-safe pagination handling
 */

// =============================================================================
// CORE INTERFACES
// =============================================================================

/**
 * Repository pagination parameters using direct database values
 * Used by repository adapters for database query operations (skip/take pattern)
 */
export interface PaginateData {
  /** Number of records to skip (0-based) */
  readonly skip: number;
  /** Number of records to take */
  readonly take: number;
}

/**
 * Simple interface for paginated data from repositories (infrastructure layer)
 * Contains raw data and minimal metadata needed for use case layer processing
 */
export interface PaginatedData<T> {
  /** Array of data items for the current page */
  readonly data: T[];
  /** Total number of documents available in the complete dataset */
  readonly totalDocs: number;
}

/**
 * Complete interface for paginated results in the application layer
 * Provides rich metadata for client consumption with navigation information
 */
export interface PaginatedResult<T> {
  /** Array of data items for the current page */
  readonly data: T[];
  /** Pagination metadata including total counts and navigation information */
  readonly paginationInfo: {
    /** Total number of documents available in the complete dataset */
    readonly totalDocs: number;
    /** Zero-based index of the first record in the current page */
    readonly start: number;
    /** Zero-based index of the last record in the current page */
    readonly end: number;
    /** Total number of pages available in the dataset */
    readonly totalPages: number;
    /** Current page number (1-based indexing) */
    readonly page: number;
    /** Next page number if available, null if on last page */
    readonly next?: number | null;
    /** Previous page number if available, null if on first page */
    readonly previous?: number | null;
  };
}

// =============================================================================
// QUERY INTERFACES
// =============================================================================

/**
 * Interface for pagination query parameters from clients
 * Used for incoming pagination requests with optional parameters
 */
export interface PaginationQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly offset?: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Default pagination limits to prevent excessive resource usage
 */
export const PAGINATION_LIMITS = {
  /** Maximum number of items per page */
  MAX_LIMIT: 100,
  /** Default number of items per page */
  DEFAULT_LIMIT: 10,
  /** Minimum number of items per page */
  MIN_LIMIT: 1,
} as const;

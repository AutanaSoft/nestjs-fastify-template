/**
 * Type definitions for pagination operations
 * Provides branded types and interfaces for type-safe pagination handling
 */

/**
 * Branded type for page numbers to prevent mixing with regular numbers
 * Ensures page numbers are properly validated and used consistently
 */
export type PageNumber = number & { readonly __brand: 'PageNumber' };

/**
 * Branded type for document counts to distinguish from other numeric values
 * Helps prevent confusion between different types of counts in the system
 */
export type DocumentCount = number & { readonly __brand: 'DocumentCount' };

/**
 * Configuration interface for pagination operations
 * Defines the required parameters for creating pagination information
 */
export interface PaginationConfig {
  readonly page: PageNumber;
  readonly limit: number;
  readonly totalDocs: DocumentCount;
}

/**
 * Interface for pagination query parameters
 * Used for incoming pagination requests from clients
 */
export interface PaginationQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly offset?: number;
}

/**
 * Type guard to validate if a number is a valid page number
 * @param value - Number to validate
 * @returns True if the value is a valid page number (positive integer)
 */
export function isValidPageNumber(value: number): value is PageNumber {
  return Number.isInteger(value) && value > 0;
}

/**
 * Type guard to validate if a number is a valid document count
 * @param value - Number to validate
 * @returns True if the value is a valid document count (non-negative integer)
 */
export function isValidDocumentCount(value: number): value is DocumentCount {
  return Number.isInteger(value) && value >= 0;
}

/**
 * Creates a validated PageNumber from a regular number
 * @param value - The page number value
 * @returns Branded PageNumber type
 * @throws Error if the value is not a valid page number
 */
export function createPageNumber(value: number): PageNumber {
  if (!isValidPageNumber(value)) {
    throw new Error(`Invalid page number: ${value}. Page numbers must be positive integers.`);
  }
  return value;
}

/**
 * Creates a validated DocumentCount from a regular number
 * @param value - The document count value
 * @returns Branded DocumentCount type
 * @throws Error if the value is not a valid document count
 */
export function createDocumentCount(value: number): DocumentCount {
  if (!isValidDocumentCount(value)) {
    throw new Error(
      `Invalid document count: ${value}. Document counts must be non-negative integers.`,
    );
  }
  return value;
}

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

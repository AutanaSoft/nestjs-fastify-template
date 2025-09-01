/**
 * Default error messages used when no custom messages are provided.
 * These messages are generic and can be overridden per module context.
 */
export const DEFAULT_PRISMA_ERROR_MESSAGES = {
  uniqueConstraint: 'Resource with these values already exists',
  notFound: 'Resource not found',
  foreignKeyConstraint: 'Invalid reference in data',
  validation: 'Invalid data provided',
  connection: 'Database unavailable',
  unknown: 'An unexpected error occurred',
} as const;

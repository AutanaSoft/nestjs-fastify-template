import { Maybe } from 'graphql/jsutils/Maybe';

/**
 * Common options interface for creating domain and application errors
 * Used to provide consistent error structure across different error types
 */
export interface ErrorOptions {
  originalError?: Maybe<Error>;
  extensions?: {
    [attributeName: string]: unknown;
    code?: string;
    statusCode?: number;
  };
}

import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * Response DTO for pagination information in GraphQL responses.
 * Provides essential metadata about paginated results including total counts,
 * current page information, and navigation indices.
 * All properties are readonly to ensure immutability of response data.
 */
@ObjectType({ description: 'Essential pagination information for paginated responses' })
export class PaginationInfoDto {
  /**
   * Total number of documents/records available in the entire dataset
   * This count represents all matching records, not just those in the current page
   */
  @Field(() => Int, {
    description: 'Total number of documents available in the complete dataset',
  })
  readonly totalDocs: number;

  /**
   * Zero-based index of the first record in the current page
   * Useful for offset-based pagination calculations
   */
  @Field(() => Int, {
    description: 'Zero-based index of the first record in the current page',
  })
  readonly start: number;

  /**
   * Zero-based index of the last record in the current page
   * Will be -1 if no records are present in the current page
   */
  @Field(() => Int, {
    description: 'Zero-based index of the last record in the current page',
  })
  readonly end: number;

  /**
   * Total number of pages available based on the page size and total documents
   * Calculated as Math.ceil(totalDocs / limit)
   */
  @Field(() => Int, {
    description: 'Total number of pages available in the dataset',
  })
  readonly totalPages: number;

  /**
   * Current page number (1-based)
   * First page is 1, not 0
   */
  @Field(() => Int, {
    description: 'Current page number (1-based indexing)',
  })
  readonly page: number;

  /**
   * Next page number (1-based) if available, otherwise null
   * Convenient for building pagination navigation
   */
  @Field(() => Int, {
    nullable: true,
    description: 'Next page number if available, null if on last page',
  })
  readonly next?: number | null;

  /**
   * Previous page number (1-based) if available, otherwise null
   * Convenient for building pagination navigation
   */
  @Field(() => Int, {
    nullable: true,
    description: 'Previous page number if available, null if on first page',
  })
  readonly previous?: number | null;
}

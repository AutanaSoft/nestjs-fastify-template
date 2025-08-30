import { PaginationInfoDto } from '../dto/responses/paginated-info-response.dto';

/**
 * Factory class for creating PaginationInfoDto instances with proper validation
 * and calculated values. Ensures data consistency and prevents invalid states.
 *
 * This factory follows the Factory pattern from Clean Architecture, separating
 * the construction logic from the DTO data representation.
 */
export class PaginationInfoFactory {
  /**
   * Creates a PaginationInfoDto instance with calculated pagination values
   * @param options - Configuration object with pagination parameters
   * @returns Properly constructed PaginationInfoDto instance
   */
  static create(options: { totalDocs: number; limit: number; page: number }): PaginationInfoDto {
    const { totalDocs, limit, page } = options;

    // Calculate derived values
    const totalPages = Math.ceil(totalDocs / limit);
    const start = Math.max(0, (page - 1) * limit);
    const currentPageDocs = Math.min(limit, Math.max(0, totalDocs - start));
    const end = currentPageDocs > 0 ? start + currentPageDocs - 1 : -1;

    const next = page < totalPages ? page + 1 : null;
    const previous = page > 1 ? page - 1 : null;

    return {
      totalDocs,
      start,
      end,
      totalPages,
      page,
      next,
      previous,
    } as PaginationInfoDto;
  }

  /**
   * Creates a PaginationInfoDto instance for empty results
   * @param limit - The requested page limit
   * @param page - The requested page number
   * @returns PaginationInfoDto representing empty pagination state
   */
  /* static createEmpty(limit: number, page: number = 1): PaginationInfoDto {
    return this.create({
      totalDocs: 0,
      limit,
      page,
    });
  } */

  /**
   * Creates a PaginationInfoDto instance for single-page results
   * @param totalDocs - Total number of documents (should be <= limit)
   * @param limit - The page limit used
   * @returns PaginationInfoDto representing single-page results
   */
  /* static createSinglePage(totalDocs: number, limit: number): PaginationInfoDto {
    return this.create({
      totalDocs,
      limit,
      page: 1,
    });
  } */
}

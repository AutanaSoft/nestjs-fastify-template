import { PaginationInfoDto } from '../dto/responses/paginated-info-response.dto';
import {
  PaginationOptions,
  PaginationIndices,
  PaginationNavigation,
} from '@shared/domain/types/pagination.types';

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
  static create(options: PaginationOptions): PaginationInfoDto {
    const { totalDocs, take, page } = options;
    const totalPages = this.calculateTotalPages(totalDocs, take);

    // Handle edge cases for empty data or out-of-range pages
    if (totalDocs === 0) {
      return this.createEmptyDataResponse(page);
    }

    if (page > totalPages) {
      return this.createOutOfRangeResponse(totalDocs, totalPages, page);
    }

    // Normal case: page is within valid range
    return this.createValidPageResponse(totalDocs, take, page, totalPages);
  }

  /**
   * Calculates the total number of pages based on total documents and page take
   * @param totalDocs - Total number of documents
   * @param take - Number of documents per page
   * @returns Total number of pages
   */
  private static calculateTotalPages(totalDocs: number, take: number): number {
    return Math.ceil(totalDocs / take);
  }

  /**
   * Creates pagination info for empty dataset
   * @param page - Requested page number
   * @returns PaginationInfoDto for empty results
   */
  private static createEmptyDataResponse(page: number): PaginationInfoDto {
    return {
      totalDocs: 0,
      start: -1,
      end: -1,
      totalPages: 0,
      page,
      next: null,
      previous: page > 1 ? page - 1 : null,
    };
  }

  /**
   * Creates pagination info for page numbers beyond available data
   * @param totalDocs - Total number of documents
   * @param totalPages - Total number of pages
   * @param page - Requested page number
   * @returns PaginationInfoDto for out-of-range page
   */
  private static createOutOfRangeResponse(
    totalDocs: number,
    totalPages: number,
    page: number,
  ): PaginationInfoDto {
    return {
      totalDocs,
      start: -1, // Indicates no data for this page
      end: -1,
      totalPages,
      page,
      next: null,
      previous: totalPages > 0 ? totalPages : null, // Point to last valid page
    };
  }

  /**
   * Creates pagination info for valid page within range
   * @param totalDocs - Total number of documents
   * @param take - Number of documents per page
   * @param page - Requested page number
   * @param totalPages - Total number of pages
   * @returns PaginationInfoDto for valid page
   */
  private static createValidPageResponse(
    totalDocs: number,
    take: number,
    page: number,
    totalPages: number,
  ): PaginationInfoDto {
    const { start, end } = this.calculateStartEndIndices(page, take, totalDocs);
    const { next, previous } = this.calculateNavigationLinks(page, totalPages);

    return {
      totalDocs,
      start,
      end,
      totalPages,
      page,
      next,
      previous,
    };
  }

  /**
   * Calculates the start and end indices for the current page
   * @param page - Current page number
   * @param take - Number of documents per page
   * @param totalDocs - Total number of documents
   * @returns Object with start and end indices
   */
  private static calculateStartEndIndices(
    page: number,
    take: number,
    totalDocs: number,
  ): PaginationIndices {
    const start = (page - 1) * take;
    const currentPageDocs = Math.min(take, Math.max(0, totalDocs - start));
    const end = currentPageDocs > 0 ? start + currentPageDocs - 1 : -1;

    return { start, end };
  }

  /**
   * Calculates the next and previous page links
   * @param page - Current page number
   * @param totalPages - Total number of pages
   * @returns Object with next and previous page numbers
   */
  private static calculateNavigationLinks(page: number, totalPages: number): PaginationNavigation {
    const next = page < totalPages ? page + 1 : null;
    const previous = page > 1 ? page - 1 : null;

    return { next, previous };
  }

  /**
   * Creates a PaginationInfoDto instance for empty results
   * @param take - The requested page take
   * @param page - The requested page number (defaults to 1)
   * @returns PaginationInfoDto representing empty pagination state
   */
  static createEmpty(take: number, page: number = 1): PaginationInfoDto {
    const options: PaginationOptions = {
      totalDocs: 0,
      take,
      page,
    };
    return this.create(options);
  }

  /**
   * Creates a PaginationInfoDto instance for single-page results
   * @param totalDocs - Total number of documents (should be <= take)
   * @param take - The page take used
   * @returns PaginationInfoDto representing single-page results
   */
  static createSinglePage(totalDocs: number, take: number): PaginationInfoDto {
    const options: PaginationOptions = {
      totalDocs,
      take,
      page: 1,
    };
    return this.create(options);
  }
}

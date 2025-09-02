import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationInfoDto } from './paginated-info-response.dto';

/**
 * Factory function to create a paginated response DTO for any entity type.
 * Provides a generic wrapper that combines data with pagination information.
 * @param classRef - Reference to the DTO class that will be used for the data array.
 * @returns A generic DTO class for paginated responses with the specified type.
 */
export function PaginatedResponse<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => PaginationInfoDto, {
      description: 'Comprehensive pagination metadata for the response',
    })
    paginationInfo: PaginationInfoDto;

    @Field(() => [classRef], {
      description: 'Array of paginated data items for the current page',
    })
    data: T[];
  }

  return PaginatedResponseClass;
}

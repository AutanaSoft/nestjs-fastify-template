import { PAGINATION_TAKE_LIMITS } from '@/shared/domain/types/pagination.types';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

@ArgsType()
export class PaginatedParamsDto {
  /** Page number starting from 1 */
  @Field(() => Int, {
    nullable: true,
    defaultValue: 1,
    description: 'Page number for pagination (starting from 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be greater than or equal to 1' })
  page: number = 1;

  /** Number of items per page (1-100) */
  @Field(() => Int, {
    nullable: true,
    defaultValue: PAGINATION_TAKE_LIMITS.DEFAULT_LIMIT,
    description: 'Number of items per page (maximum 100)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Take must be an integer' })
  @Min(PAGINATION_TAKE_LIMITS.MIN_LIMIT, {
    message: `Take must be greater than or equal to ${PAGINATION_TAKE_LIMITS.MIN_LIMIT}`,
  })
  @Max(PAGINATION_TAKE_LIMITS.MAX_LIMIT, {
    message: `Take must be less than or equal to ${PAGINATION_TAKE_LIMITS.MAX_LIMIT}`,
  })
  take: number = PAGINATION_TAKE_LIMITS.DEFAULT_LIMIT;
}

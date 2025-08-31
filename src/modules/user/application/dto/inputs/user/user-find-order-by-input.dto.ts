import { SortOrder, UserOrderBy } from '@/modules/user/domain/enums';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

/**
 * GraphQL input DTO for sorting user query results
 * Provides default values for sorting by creation date in descending order
 */
@InputType()
export class UserFindOrderByInputDto {
  @Field(() => UserOrderBy, {
    nullable: true,
    defaultValue: UserOrderBy.CREATED_AT,
    description: 'Field to sort user results by (defaults to creation date)',
  })
  @IsOptional()
  @IsEnum(UserOrderBy, { message: 'Sort by must be a valid UserSortBy enum value' })
  by?: UserOrderBy = UserOrderBy.CREATED_AT;

  @Field(() => SortOrder, {
    nullable: true,
    defaultValue: SortOrder.DESC,
    description: 'Sort order direction for user results (defaults to descending)',
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'Sort order must be a valid SortOrder enum value' })
  order?: SortOrder = SortOrder.DESC;
}

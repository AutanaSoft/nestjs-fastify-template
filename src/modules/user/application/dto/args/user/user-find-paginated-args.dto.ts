import { PaginatedParamsDto } from '@/shared/application/dto/inputs';
import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UserFindFilterInputDto, UserFindOrderByInputDto } from '../../inputs';

/**
 * GraphQL ArgsType for paginated user queries with filtering and sorting capabilities.
 *
 * This DTO extends the base PaginatedParamsDto to provide pagination parameters
 * and adds user-specific filtering and ordering options for GraphQL queries.
 *
 * @see {@link PaginatedParamsDto} Base pagination parameters
 * @see {@link UserFindFilterInputDto} Available filter options
 * @see {@link UserFindOrderByInputDto} Available sorting options
 */
@ArgsType()
export class UserFindPaginatedArgsDto extends PaginatedParamsDto {
  @Field(() => UserFindFilterInputDto, {
    nullable: true,
    description: 'Optional filter criteria for user search',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFindFilterInputDto)
  filter?: UserFindFilterInputDto;

  @Field(() => UserFindOrderByInputDto, {
    nullable: true,
    description: 'Optional sorting parameters for user results',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFindOrderByInputDto)
  orderBy?: UserFindOrderByInputDto;
}

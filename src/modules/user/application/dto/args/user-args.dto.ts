import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UserCreateInputDto, UserFindFilterInputDto, UserSortOrderInputDto } from '../inputs';

/**
 * GraphQL arguments DTO for user creation operations
 * Contains all required data for creating a new user account
 */
@ArgsType()
export class UserCreateArgsDto {
  /** User creation data containing email, username, password and optional role/status */
  @Field(() => UserCreateInputDto, { description: 'Data required to create a new user' })
  @ValidateNested()
  @Type(() => UserCreateInputDto)
  data!: UserCreateInputDto;
}

/**
 * GraphQL arguments DTO for user search operations
 * Contains optional filtering and sorting parameters for querying users
 */
@ArgsType()
export class UserFindArgsDto {
  /** Optional filter criteria to narrow down user search results */
  @Field(() => UserFindFilterInputDto, {
    nullable: true,
    description: 'Optional filter criteria for user search',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFindFilterInputDto)
  filter?: UserFindFilterInputDto;

  /** Optional sorting configuration to order user search results */
  @Field(() => UserSortOrderInputDto, {
    nullable: true,
    description: 'Optional sorting parameters for user results',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserSortOrderInputDto)
  sort?: UserSortOrderInputDto;
}

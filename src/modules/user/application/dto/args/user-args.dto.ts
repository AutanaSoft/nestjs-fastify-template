import { ArgsType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { IsValidUsername } from '@shared/application/decorators';
import {
  UserCreateInputDto,
  UserFindFilterInputDto,
  UserSortOrderInputDto,
  UserUpdateInputDto,
} from '../inputs';

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

@ArgsType()
export class UserUpdateArgsDto {
  /** Unique identifier of the user to update */
  @Field(() => ID, { description: 'Unique identifier of the user to update' })
  @IsUUID('all', { message: 'ID must be a valid ID' })
  id: string;

  /** User update data containing optional fields to update */
  @Field(() => UserUpdateInputDto, { description: 'Data required to update an existing user' })
  @ValidateNested()
  @Type(() => UserUpdateInputDto)
  data!: UserUpdateInputDto;
}

/**
 * GraphQL arguments DTO for finding a user by their unique identifier
 * Contains validation for the user ID parameter
 */
@ArgsType()
export class UserFindByIdArgsDto {
  /** Unique identifier of the user to find */
  @Field(() => ID, { description: 'Unique identifier of the user to find' })
  @IsUUID('all', { message: 'ID must be a valid UUID' })
  id!: string;
}

/**
 * GraphQL arguments DTO for finding a user by their username
 * Contains validation and normalization for the username parameter
 */
@ArgsType()
export class UserFindByUsernameArgsDto {
  /** Username of the user to find */
  @Field(() => String, { description: 'Username of the user to find' })
  @IsValidUsername()
  userName!: string;
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

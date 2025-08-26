import { SortOrder, UserRole, UserSortBy, UserStatus } from '@/modules/user/domain/enums';
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * GraphQL input DTO for user creation operations
 * Contains all required and optional fields for creating a new user account
 */
@InputType()
export class UserCreateInputDto {
  /** User's email address - must be unique and valid email format */
  @Field(() => String, { nullable: false, description: 'User email address for authentication' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  /** User's password - will be hashed before storage, must be 6-16 characters */
  @Field(() => String, {
    nullable: false,
    description: 'User password for authentication (6-16 characters)',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(16, { message: 'Password must be at most 16 characters long' })
  password: string;

  /** User's display name - must be unique and non-empty */
  @Field(() => String, { nullable: false, description: 'Unique username for user identification' })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  userName: string;

  /** Optional user account status - defaults to ACTIVE if not provided */
  @Field(() => UserStatus, { nullable: true, description: 'Optional initial account status' })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be a valid UserStatus enum value' })
  status?: UserStatus;

  /** Optional user role assignment - defaults to USER if not provided */
  @Field(() => UserRole, { nullable: true, description: 'Optional initial user role assignment' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid UserRole enum value' })
  role?: UserRole;
}

/**
 * GraphQL input DTO for user update operations
 * Contains optional fields that can be updated for an existing user
 */
@InputType()
export class UserUpdateInputDto extends PartialType(
  OmitType(UserCreateInputDto, ['email'] as const),
) {}

/**
 * GraphQL input DTO for filtering user search results
 * All fields are optional and combined with AND logic when multiple filters are applied
 */
@InputType()
export class UserFindFilterInputDto {
  /** Filter users by their account status */
  @Field(() => UserStatus, { nullable: true, description: 'Filter users by account status' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  /** Filter users by their assigned role */
  @Field(() => UserRole, { nullable: true, description: 'Filter users by assigned role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  /** Filter users by exact email address match */
  @Field(() => String, { nullable: true, description: 'Filter users by email address pattern' })
  @IsOptional()
  @IsString()
  email?: string;

  /** Filter users by exact username match */
  @Field(() => String, { nullable: true, description: 'Filter users by username pattern' })
  @IsOptional()
  @IsString()
  userName?: string;

  /** Filter users created on or after this date */
  @Field(() => Date, { nullable: true, description: 'Filter users created after this date' })
  @IsOptional()
  createdAtFrom?: Date;

  /** Filter users created on or before this date */
  @Field(() => Date, { nullable: true, description: 'Filter users created before this date' })
  @IsOptional()
  createdAtTo?: Date;
}

/**
 * GraphQL input DTO for sorting user query results
 * Provides default values for sorting by creation date in descending order
 */
@InputType()
export class UserSortOrderInputDto {
  /** Field to sort user results by - defaults to creation date */
  @Field(() => UserSortBy, {
    nullable: true,
    defaultValue: UserSortBy.CREATED_AT,
    description: 'Field to sort user results by (defaults to creation date)',
  })
  @IsOptional()
  @IsEnum(UserSortBy, { message: 'Sort by must be a valid UserSortBy enum value' })
  sortBy?: UserSortBy = UserSortBy.CREATED_AT;

  /** Sort direction - defaults to descending (newest first) */
  @Field(() => SortOrder, {
    nullable: true,
    defaultValue: SortOrder.DESC,
    description: 'Sort order direction for user results (defaults to descending)',
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'Sort order must be a valid SortOrder enum value' })
  sortOrder?: SortOrder = SortOrder.DESC;
}

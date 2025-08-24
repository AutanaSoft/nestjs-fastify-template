import { SortOrder, UserRole, UserSortBy, UserStatus } from '@/modules/user/domain/enums';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'Enum defining available user account status values',
});

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Enum defining available user role types',
});

@InputType()
export class UserCreateInputDto {
  @Field(() => String, { nullable: false, description: 'User email address for authentication' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @Field(() => String, {
    nullable: false,
    description: 'User password for authentication (6-16 characters)',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(16, { message: 'Password must be at most 16 characters long' })
  password: string;

  @Field(() => String, { nullable: false, description: 'Unique username for user identification' })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  userName: string;

  @Field(() => UserStatus, { nullable: true, description: 'Optional initial account status' })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be a valid UserStatus enum value' })
  status?: UserStatus;

  @Field(() => UserRole, { nullable: true, description: 'Optional initial user role assignment' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid UserRole enum value' })
  role?: UserRole;
}

@InputType()
export class UserUpdateInputDto {
  @Field(() => String, { nullable: true, description: 'Updated user account status' })
  status?: UserStatus;

  @Field(() => String, { nullable: true, description: 'Updated user role assignment' })
  role?: UserRole;
}

@InputType()
export class UserFindFilterInputDto {
  @Field(() => UserStatus, { nullable: true, description: 'Filter users by account status' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @Field(() => UserRole, { nullable: true, description: 'Filter users by assigned role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @Field(() => String, { nullable: true, description: 'Filter users by email address pattern' })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => String, { nullable: true, description: 'Filter users by username pattern' })
  @IsOptional()
  @IsString()
  userName?: string;

  @Field(() => Date, { nullable: true, description: 'Filter users created after this date' })
  @IsOptional()
  createdAtFrom?: Date;

  @Field(() => Date, { nullable: true, description: 'Filter users created before this date' })
  @IsOptional()
  createdAtTo?: Date;
}

registerEnumType(UserSortBy, {
  name: 'UserSortBy',
  description: 'Enum defining available fields for sorting user results',
});

registerEnumType(SortOrder, {
  name: 'SortOrder',
  description: 'Enum defining available sort order directions (ASC/DESC)',
});

@InputType()
export class UserSortOrderInputDto {
  @Field(() => UserSortBy, {
    nullable: true,
    defaultValue: UserSortBy.CREATED_AT,
    description: 'Field to sort user results by (defaults to creation date)',
  })
  @IsOptional()
  @IsEnum(UserSortBy, { message: 'Sort by must be a valid UserSortBy enum value' })
  sortBy?: UserSortBy = UserSortBy.CREATED_AT;

  @Field(() => SortOrder, {
    nullable: true,
    defaultValue: SortOrder.DESC,
    description: 'Sort order direction for user results (defaults to descending)',
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'Sort order must be a valid SortOrder enum value' })
  sortOrder?: SortOrder = SortOrder.DESC;
}

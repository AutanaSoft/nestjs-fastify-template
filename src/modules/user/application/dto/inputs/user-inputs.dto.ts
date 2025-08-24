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
});

registerEnumType(UserRole, {
  name: 'UserRole',
});

@InputType()
export class UserCreateInputDto {
  @Field(() => String, { nullable: false })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @Field(() => String, { nullable: false })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(16, { message: 'Password must be at most 16 characters long' })
  password: string;

  @Field(() => String, { nullable: false })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  userName: string;

  @Field(() => UserStatus, { nullable: true })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be a valid UserStatus enum value' })
  status?: UserStatus;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid UserRole enum value' })
  role?: UserRole;
}

@InputType()
export class UserUpdateInputDto {
  @Field(() => String, { nullable: true })
  status?: UserStatus;

  @Field(() => String, { nullable: true })
  role?: UserRole;
}

@InputType()
export class UserFindFilterInputDto {
  @Field(() => UserStatus, { nullable: true })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  userName?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  createdAtFrom?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  createdAtTo?: Date;
}

registerEnumType(UserSortBy, {
  name: 'UserSortBy',
  description: 'The sort by options for users',
});

registerEnumType(SortOrder, {
  name: 'SortOrder',
  description: 'The sort order options',
});

@InputType()
export class UserSortOrderInputDto {
  @Field(() => UserSortBy, { nullable: true, defaultValue: UserSortBy.CREATED_AT })
  @IsOptional()
  @IsEnum(UserSortBy, { message: 'Sort by must be a valid UserSortBy enum value' })
  sortBy?: UserSortBy = UserSortBy.CREATED_AT;

  @Field(() => SortOrder, { nullable: true, defaultValue: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'Sort order must be a valid SortOrder enum value' })
  sortOrder?: SortOrder = SortOrder.DESC;
}

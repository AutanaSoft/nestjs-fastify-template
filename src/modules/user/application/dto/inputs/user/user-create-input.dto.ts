import { UserRole, UserStatus } from '@/modules/user/domain/enums';
import { IsValidEmail, IsValidUsername } from '@/shared/application/decorators';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * GraphQL input DTO for user creation operations
 * Contains all required and optional fields for creating a new user account
 */
@InputType()
export class UserCreateInputDto {
  @Field(() => String, { nullable: false, description: 'User email address for authentication' })
  @IsValidEmail()
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
  @IsValidUsername()
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

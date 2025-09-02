import { IsValidEmail, IsValidUsername } from '@/shared/application/decorators';
import { UserRole, UserStatus } from '@/modules/user/domain/enums';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

/**
 * GraphQL input DTO for filtering user search results
 * All fields are optional and combined with AND logic when multiple filters are applied
 */
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
  @IsValidEmail()
  email?: string;

  @Field(() => String, { nullable: true, description: 'Filter users by username pattern' })
  @IsOptional()
  @IsValidUsername()
  userName?: string;

  @Field(() => Date, { nullable: true, description: 'Filter users created after this date' })
  @IsOptional()
  createdAtFrom?: Date;

  @Field(() => Date, { nullable: true, description: 'Filter users created before this date' })
  @IsOptional()
  createdAtTo?: Date;
}

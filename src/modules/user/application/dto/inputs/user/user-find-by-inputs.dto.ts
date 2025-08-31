import { IsValidEmail, IsValidUsername } from '@/shared/application/decorators';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * DTO for finding a user by their ID
 */
@ObjectType()
export class UserFindByIdInputDto {
  @Field(() => ID, { description: 'Unique identifier of the user' })
  @IsUUID('all', { message: 'ID must be a valid UUID' })
  id: string;
}

/**
 * DTO for finding a user by their email
 */
@ObjectType()
export class UserFindByEmailInputDto {
  @Field(() => String, { description: 'Email address of the user' })
  @IsValidEmail()
  email: string;
}

/**
 * DTO for finding a user by their userName
 */
@ObjectType()
export class UserFindByUserNameInputDto {
  @Field(() => String, { description: 'Username of the user' })
  @IsValidUsername()
  userName: string;
}

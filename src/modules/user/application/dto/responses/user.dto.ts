import { UserRole, UserStatus } from '@/modules/user/domain/enums';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Register user data' })
export class UserDto {
  @Field(() => String, { description: 'User unique identifier' })
  id: string;

  @Field(() => String, { description: 'User email address' })
  email: string;

  @Field(() => String, { description: 'User name' })
  userName: string;

  @Field(() => UserStatus, { description: 'User status' })
  status: UserStatus;

  @Field(() => UserRole, { description: 'User role' })
  role: UserRole;

  @Field(() => Date, { description: 'User account creation date' })
  createdAt: Date;

  @Field(() => Date, { description: 'User account last update date' })
  updatedAt: Date;
}

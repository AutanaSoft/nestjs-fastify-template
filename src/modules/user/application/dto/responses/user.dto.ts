import { UserRole, UserStatus } from '@/modules/user/domain/enums';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'User account data representation' })
export class UserDto {
  @Field(() => String, { description: 'Unique user identifier' })
  id: string;

  @Field(() => String, { description: 'User email address for authentication' })
  email: string;

  @Field(() => String, { description: 'Unique username for user identification' })
  userName: string;

  @Field(() => UserStatus, { description: 'Current user account status' })
  status: UserStatus;

  @Field(() => UserRole, { description: 'Assigned user role for authorization' })
  role: UserRole;

  @Field(() => Date, { description: 'Account creation timestamp' })
  createdAt: Date;

  @Field(() => Date, { description: 'Last account modification timestamp' })
  updatedAt: Date;
}

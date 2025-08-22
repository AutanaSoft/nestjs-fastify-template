import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole, UserStatus } from '../../domain/enums';

@ObjectType()
export class UserDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  userName: string;

  @Field(() => UserStatus)
  status: UserStatus;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

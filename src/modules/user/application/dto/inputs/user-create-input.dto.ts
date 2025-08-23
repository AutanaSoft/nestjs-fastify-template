import { UserRole, UserStatus } from '@/modules/user/domain/enums';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserCreateInputDto {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  userName: string;

  @Field(() => UserStatus)
  status: UserStatus;

  @Field(() => UserRole)
  role: UserRole;
}

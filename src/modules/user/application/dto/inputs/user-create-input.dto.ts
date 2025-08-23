import { UserRole, UserStatus } from '@/modules/user/domain/enums';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

registerEnumType(UserRole, {
  name: 'UserRole',
});

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

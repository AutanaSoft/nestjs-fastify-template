import { UserRole, UserStatus } from '@/modules/user/domain/enums';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserUpdateInputDto {
  @Field(() => String, { nullable: true })
  status?: UserStatus;

  @Field(() => String, { nullable: true })
  role?: UserRole;
}

import { Field, InputType } from '@nestjs/graphql';
import { UserRole, UserStatus } from '../../domain/enums';

@InputType()
export class UserUpdateInputDto {
  @Field(() => String, { nullable: true })
  status?: UserStatus;

  @Field(() => String, { nullable: true })
  role?: UserRole;
}

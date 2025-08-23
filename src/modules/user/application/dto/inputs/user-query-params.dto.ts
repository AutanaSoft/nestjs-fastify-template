import { UserRole, UserStatus } from '@/modules/user/domain/enums';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UserQueryParamsDto {
  @Field(() => String, { nullable: true })
  status?: UserStatus;

  @Field(() => String, { nullable: true })
  role?: UserRole;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  userName?: string;

  @Field(() => Int, { nullable: true })
  page?: number = 1;

  @Field(() => Int, { nullable: true })
  limit?: number = 10;

  @Field(() => String, { nullable: true })
  sortBy?: 'createdAt' | 'updatedAt' | 'email' | 'userName' = 'createdAt';

  @Field(() => String, { nullable: true })
  sortOrder?: 'asc' | 'desc' = 'desc';
}

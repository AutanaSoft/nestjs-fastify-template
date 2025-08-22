import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserCreateInputDto {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  userName: string;
}

import { IsValidPassword } from '@/shared/application/decorators';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInInputDto {
  @Field(() => String)
  credential: string;

  @Field(() => String)
  @IsValidPassword()
  password: string;
}

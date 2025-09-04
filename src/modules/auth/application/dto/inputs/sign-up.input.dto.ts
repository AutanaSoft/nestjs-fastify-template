import { IsValidEmail, IsValidPassword, IsValidUsername } from '@/shared/application/decorators';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignUpInputDto {
  @Field(() => String)
  @IsValidEmail()
  email: string;

  @Field(() => String)
  @IsValidUsername()
  userName: string;

  @Field(() => String)
  @IsValidPassword()
  password: string;
}

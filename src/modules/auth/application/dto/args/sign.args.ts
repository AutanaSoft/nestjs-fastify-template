import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { SignInInputDto } from '../inputs';
import { SignUpInputDto } from '../inputs/sign-up.input.dto';

@ArgsType()
export class SignUpArgsDto {
  @Field(() => SignUpInputDto)
  @ValidateNested()
  @Type(() => SignUpInputDto)
  input!: SignUpInputDto;
}

@ArgsType()
export class SignInArgsDto {
  @Field(() => SignInInputDto)
  @Type(() => SignInInputDto)
  @ValidateNested()
  input: SignInInputDto;
}

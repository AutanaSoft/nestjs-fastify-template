import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AppInfoResponseDto {
  @Field(() => String)
  readonly message: string;

  @Field(() => String)
  readonly name: string;

  @Field(() => String)
  readonly version: string;

  @Field(() => String)
  readonly correlationId: string;
}

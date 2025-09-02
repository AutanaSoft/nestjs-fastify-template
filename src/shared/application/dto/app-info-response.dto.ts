import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Application information' })
export class AppInfoResponseDto {
  @Field(() => String, { description: 'Success message' })
  readonly message: string;

  @Field(() => String, { description: 'Application name' })
  readonly name: string;

  @Field(() => String, { description: 'Application version' })
  readonly version: string;
}

import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { AppInfoResponseDto } from './app-info-response.dto';

@ObjectType()
export class DatabaseHealthDto {
  @Field(() => String)
  readonly status: string;
}

@ObjectType()
export class HealthCheckResponseDto extends OmitType(AppInfoResponseDto, ['message'] as const) {
  @Field(() => String)
  readonly status: string;

  @Field(() => String)
  readonly timestamp: string;

  @Field(() => DatabaseHealthDto)
  readonly database: DatabaseHealthDto;
}

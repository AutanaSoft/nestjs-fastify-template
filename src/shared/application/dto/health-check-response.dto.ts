import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { AppInfoResponseDto } from './app-info-response.dto';

@ObjectType({ description: 'Database health status' })
export class DatabaseHealthDto {
  @Field(() => String, { description: 'Database connection status' })
  readonly status: string;

  @Field(() => String, { description: 'Database response message' })
  readonly message: string;
}

@ObjectType({ description: 'Health check response' })
export class HealthCheckResponseDto extends OmitType(AppInfoResponseDto, ['message'] as const) {
  @Field(() => String, { description: 'Health check status' })
  readonly status: string;

  @Field(() => String, { description: 'Health check timestamp' })
  readonly timestamp: string;

  @Field(() => DatabaseHealthDto, { description: 'Database health status' })
  readonly database: DatabaseHealthDto;
}

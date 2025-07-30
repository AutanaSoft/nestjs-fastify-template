import { ApiProperty, OmitType } from '@nestjs/swagger';
import { AppInfoResponseDto } from './app-info-response.dto';

export class DatabaseHealthDto {
  @ApiProperty({
    description: 'Database health status',
    example: 'ok',
  })
  readonly status: string;
}

export class HealthCheckResponseDto extends OmitType(AppInfoResponseDto, ['message'] as const) {
  @ApiProperty({
    description: 'Application health status',
    example: 'ok',
  })
  readonly status: string;

  @ApiProperty({
    description: 'Timestamp of the health check',
    example: '2025-07-30T12:00:00.000Z',
  })
  readonly timestamp: string;

  @ApiProperty({
    description: 'Database health information',
    type: DatabaseHealthDto,
  })
  readonly database: DatabaseHealthDto;
}

import { AppInfoResponseDto } from './app-info-response.dto';

export class DatabaseHealthDto {
  readonly status: string;
}

export class HealthCheckResponseDto extends OmitType(AppInfoResponseDto, ['message'] as const) {
  readonly status: string;

  readonly timestamp: string;

  readonly database: DatabaseHealthDto;
}

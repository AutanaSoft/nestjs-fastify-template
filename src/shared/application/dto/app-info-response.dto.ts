import { ApiProperty } from '@nestjs/swagger';

export class AppInfoResponseDto {
  @ApiProperty({
    description: 'Welcome message',
    example: 'Welcome to NestJS Template API',
  })
  readonly message: string;

  @ApiProperty({
    description: 'Application name',
    example: 'nest-template',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Application version',
    example: '1.0.0',
  })
  readonly version: string;

  @ApiProperty({
    description: 'Correlation ID for the request',
    example: 'b0f8f3e5-4b5a-4b0e-8b0a-3b0c8b0a3b0c',
  })
  readonly correlationId: string;
}

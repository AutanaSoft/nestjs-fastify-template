import { ApiProperty } from '@nestjs/swagger';

export class HelloResponseDto {
  @ApiProperty({
    description: 'Hello message response',
    example: 'Hello, World!',
    type: String,
  })
  msg: string;

  constructor(message: string) {
    this.msg = message;
  }
}

import { IsNotEmpty, IsString } from 'class-validator';

export class SayHelloRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

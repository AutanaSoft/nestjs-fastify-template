import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class UserCreateInputDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    maxLength: 50,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @Expose()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongP@ss.1',
    minLength: 6,
    maxLength: 16,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$.\-_])[\w@#$.\-_]+$/, {
    message:
      'password must contain at least one uppercase letter, one number, and one special character (@#$.-_)',
  })
  @Expose()
  password: string;

  @ApiProperty({
    description: 'User name',
    example: 'john_doe.123',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[\w.-_]+$/, {
    message: 'userName can only contain alphanumeric characters and the symbols . - _',
  })
  @Expose()
  userName: string;
}

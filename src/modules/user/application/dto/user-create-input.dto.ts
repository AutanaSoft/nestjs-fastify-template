import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserCreateInputDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'email should not be empty' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  @MaxLength(50, { message: 'email must be shorter than or equal to 50 characters' })
  @MinLength(6, { message: 'email must be longer than or equal to 5 characters' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongP@ss.1',
    minLength: 6,
    maxLength: 16,
  })
  @IsNotEmpty({ message: 'password should not be empty' })
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be longer than or equal to 6 characters' })
  @MaxLength(16, { message: 'password must be shorter than or equal to 16 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$.\-_])[\w@#$.\-_]+$/, {
    message:
      'password must contain at least one uppercase letter, one number, and one special character (@#$.-_)',
  })
  password: string;

  @ApiProperty({
    description: 'User name',
    example: 'john_doe.123',
    minLength: 3,
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'userName should not be empty' })
  @IsString({ message: 'userName must be a string' })
  @MinLength(3, { message: 'userName must be longer than or equal to 3 characters' })
  @MaxLength(20, { message: 'userName must be shorter than or equal to 20 characters' })
  @Matches(/^[\w.-_]+$/, {
    message: 'userName can only contain alphanumeric characters and the symbols . - _',
  })
  userName: string;
}

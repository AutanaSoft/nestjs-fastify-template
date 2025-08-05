import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole, UserStatus } from '../../domain/enums';

export class UserUpdateInputDto {
  @ApiProperty({
    description: 'User status',
    example: UserStatus.ACTIVE,
    enum: UserStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'status must be a valid user status' })
  status?: UserStatus;

  @ApiProperty({
    description: 'User role',
    example: UserRole.USER,
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'role must be a valid user role' })
  role?: UserRole;
}

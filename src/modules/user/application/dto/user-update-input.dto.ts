import { ApiProperty } from '@nestjs/swagger';
import { UserStatus, UserRole } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UserUpdateInputDto {
  @ApiProperty({
    description: 'User status',
    example: UserStatus.ACTIVE,
    enum: UserStatus,
    required: false,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({
    description: 'User role',
    example: UserRole.USER,
    enum: UserRole,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

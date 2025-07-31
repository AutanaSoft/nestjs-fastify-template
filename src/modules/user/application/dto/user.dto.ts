import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';

export class UserDto {
  @ApiProperty({ description: 'User ID', example: 'clx...' })
  id: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ description: 'User name', example: 'john_doe.123' })
  userName: string;

  @ApiProperty({ description: 'User status', enum: UserStatus, example: UserStatus.ACTIVE })
  status: UserStatus;

  @ApiProperty({ description: 'User role', enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

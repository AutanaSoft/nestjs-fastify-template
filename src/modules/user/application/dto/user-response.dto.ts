import { ApiProperty } from '@nestjs/swagger';
import { UserStatus, UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'john_doe.123',
  })
  userName: string;

  @ApiProperty({
    description: 'User status',
    example: UserStatus.ACTIVE,
    enum: UserStatus,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'User role',
    example: UserRole.USER,
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User creation date',
    example: '2025-07-31T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2025-07-31T10:00:00Z',
  })
  updatedAt: Date;
}

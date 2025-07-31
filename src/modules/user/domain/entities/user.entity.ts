import { UserStatus, UserRole } from '@prisma/client';

export class UserEntity {
  id: string;
  email: string;
  password: string;
  userName: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  // Method to return user without password for API responses
  toResponseObject(): Omit<UserEntity, 'password' | 'toResponseObject'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

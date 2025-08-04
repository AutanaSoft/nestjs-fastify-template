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
}

import { UserStatus } from '@prisma/client';

export class UserEntity {
  id: string;
  email: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

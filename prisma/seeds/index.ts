import { PrismaClient } from '@prisma/client';
import { Seeder } from './_types';
import { seedUsers } from './user';

export const senderUsers: Seeder = {
  name: 'users',
  run: (prisma: PrismaClient) => seedUsers(prisma),
};

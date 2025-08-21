import { PrismaClient } from '@prisma/client';
import { SeedContext, Seeder } from './_types';
import { seedUsers } from './user';

export const senderUsers: Seeder = {
  name: 'users',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run: (prisma: PrismaClient, _ctx: SeedContext) => seedUsers(prisma),
};

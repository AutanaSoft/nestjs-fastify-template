import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const usersData: Prisma.UserCreateInput[] = [
  {
    email: 'admin@admin.com',
    password: 'admin',
    role: 'ADMIN',
    userName: 'Admin',
  },
];

export const seedUsers = async (prisma: PrismaClient) => {
  const salt = await bcrypt.genSalt();

  await prisma.$transaction(async tx => {
    for (const user of usersData) {
      const hashedPassword = await bcrypt.hash(user.password, salt);

      await tx.user.upsert({
        where: { email: user.email },
        update: { ...user, password: hashedPassword },
        create: { ...user, password: hashedPassword },
      });
    }
  });
};

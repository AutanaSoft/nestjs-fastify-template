import { Prisma, PrismaClient, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const usersData: Prisma.UserCreateInput[] = [
  {
    email: process.env.ADMIN_EMAIL || 'admin@admin.com',
    password: process.env.ADMIN_PASSWORD || 'admin',
    role: 'ADMIN',
    userName: 'admin',
    status: 'ACTIVE', // Agregar status explícito
  },
];

// Validación simple de datos
const validateUsersData = (users: Prisma.UserCreateInput[]): void => {
  console.log(`Validating ${users.length} users...`);

  const emails = new Set<string>();
  const userNames = new Set<string>();

  for (const user of users) {
    // Validar email único
    if (emails.has(user.email)) {
      throw new Error(`Duplicate email found: ${user.email}`);
    }
    emails.add(user.email);

    // Validar userName único
    if (userNames.has(user.userName)) {
      throw new Error(`Duplicate userName found: ${user.userName}`);
    }
    userNames.add(user.userName);

    // Validar email básico
    if (!user.email.includes('@')) {
      throw new Error(`Invalid email format: ${user.email}`);
    }

    // Validar password no vacío
    if (!user.password || user.password.trim().length === 0) {
      throw new Error(`Empty password for user: ${user.email}`);
    }
  }

  console.log('✅ User data validation passed');
};

export const seedUsers = async (prisma: PrismaClient): Promise<void> => {
  console.log('🌱 Starting user seeding...');

  // Validar datos antes de procesar
  validateUsersData(usersData);

  // Generar salt una sola vez para todos los usuarios (optimización)
  console.log('🔐 Generating password salt...');
  const salt = await bcrypt.genSalt(12);

  await prisma.$transaction(
    async tx => {
      let created = 0;
      let updated = 0;

      for (const userData of usersData) {
        console.log(`Processing user: ${userData.email}`);

        try {
          const hashedPassword = await bcrypt.hash(userData.password, salt);

          // Verificar si existe para logging más preciso
          const existingUser = await tx.user.findUnique({
            where: { email: userData.email },
            select: { id: true },
          });

          await tx.user.upsert({
            where: { email: userData.email },
            update: {
              password: hashedPassword,
              userName: userData.userName,
              role: userData.role,
              status: (userData.status as UserStatus) || 'ACTIVE',
            },
            create: {
              ...userData,
              password: hashedPassword,
              status: (userData.status as UserStatus) || 'ACTIVE',
            },
          });

          if (existingUser) {
            updated++;
            console.log(`  ✅ Updated: ${userData.email}`);
          } else {
            created++;
            console.log(`  🆕 Created: ${userData.email}`);
          }
        } catch (error) {
          console.error(`  ❌ Error with ${userData.email}:`, (error as Error).message);
          throw error;
        }
      }

      console.log(`📊 Users summary: ${created} created, ${updated} updated`);
    },
    {
      timeout: 30000, // 30 segundos de timeout
    },
  );

  console.log('✅ User seeding completed');
};

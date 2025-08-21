import { PrismaClient } from '@prisma/client';
import { SeedContext, Seeder } from './seeds/_types';
import { senderUsers } from './seeds/index';

const prisma = new PrismaClient();

const mode = (process.env.SEED_MODE ?? 'base') as SeedContext['mode'];

const logger = (message: string, meta: Record<string, unknown> = {}) => {
  // Structured JSON logging for better observability
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: 'info',
      message,
      ...meta,
    }),
  );
};

// Keep dependency order: tiers -> currencies -> countries -> users
const seeds: Seeder[] = [...(mode !== 'base' ? [senderUsers] : [])];

async function main() {
  const ctx: SeedContext = { logger, now: new Date(), mode };

  logger('Seeding started', { mode });

  for (const seeder of seeds) {
    logger('Seeder running', { seeder: seeder.name });
    try {
      await seeder.run(prisma, ctx);
      logger('Seeder completed', { seeder: seeder.name });
    } catch (error) {
      // Fail fast, but ensure proper disconnect is executed in the catch below
      console.error(
        JSON.stringify({
          ts: new Date().toISOString(),
          level: 'error',
          message: 'Seeder failed',
          seeder: seeder.name,
          error: (error as Error).message,
        }),
      );
      throw error;
    }
  }

  logger('Seeding finished');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    await prisma.$disconnect();
    // Do not leak stack traces in logs by default; keep message concise
    process.exitCode = 1;
    logger('Seeding failed', { error: (e as Error).message });
  });

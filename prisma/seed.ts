import { PrismaClient } from '@prisma/client';
import { SeedContext, Seeder } from './seeds/_types';
import { senderUsers } from './seeds/index';

const prisma = new PrismaClient({
  log: ['error'], // Solo errores para no saturar el log
});

const logger = (message: string, meta: Record<string, unknown> = {}) => {
  const timestamp = new Date().toISOString();
  const metaString =
    Object.keys(meta).length > 0
      ? ` - ${Object.entries(meta)
          .map(([k, v]) => `${k}=${String(v)}`)
          .join(', ')}`
      : '';
  console.log(`[${timestamp}] ${message}${metaString}`);
};

// Lista de seeders a ejecutar
const seeds: Seeder[] = [senderUsers];

async function main() {
  const startTime = Date.now();
  const ctx: SeedContext = { logger, now: new Date() };

  logger('Seeding started');

  try {
    logger('Seeds to execute', { count: seeds.length });

    for (const seeder of seeds) {
      logger('Seeder starting', { seeder: seeder.name });

      const seederStart = Date.now();
      await seeder.run(prisma, ctx);
      const seederDuration = Date.now() - seederStart;

      logger('Seeder completed', {
        seeder: seeder.name,
        duration: `${seederDuration}ms`,
      });
    }

    const totalDuration = Date.now() - startTime;
    logger('Seeding finished successfully', {
      totalDuration: `${totalDuration}ms`,
      seedsExecuted: seeds.length,
    });
  } catch (error) {
    const errorDuration = Date.now() - startTime;
    console.error(
      `[${new Date().toISOString()}] ❌ Seeding failed after ${errorDuration}ms: ${(error as Error).message}`,
    );
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🎉 Seed process completed successfully');
    process.exit(0);
  })
  .catch(async e => {
    await prisma.$disconnect();
    console.error('💥 Fatal error during seeding:', (e as Error).message);
    process.exit(1);
  });

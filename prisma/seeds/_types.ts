import { PrismaClient } from '@prisma/client';

export interface SeedContext {
  logger: (message: string, meta?: Record<string, unknown>) => void;
  now: Date;
}

export interface Seeder {
  name: string;
  run(prisma: PrismaClient, ctx: SeedContext): Promise<void>;
}

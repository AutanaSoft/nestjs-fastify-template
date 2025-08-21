import { PrismaClient } from '@prisma/client';

export type SeedMode = 'base' | 'dev' | 'test';

export interface SeedContext {
  logger: (message: string, meta?: Record<string, unknown>) => void;
  now: Date;
  mode: SeedMode;
}

export interface Seeder {
  name: string;
  run(prisma: PrismaClient, ctx: SeedContext): Promise<void>;
}

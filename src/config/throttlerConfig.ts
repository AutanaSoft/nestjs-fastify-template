import { registerAs } from '@nestjs/config';

export type ThrottlerConfig = {
  ttl: number;
  limit: number;
  skipIf?: (context: any) => boolean;
};

export default registerAs(
  'throttlerConfig',
  (): ThrottlerConfig => ({
    ttl: parseInt(process.env.THROTTLER_TTL || '60000', 10), // 60 seconds by default
    limit: parseInt(process.env.THROTTLER_LIMIT || '10', 10), // 10 requests per TTL by default
    skipIf: process.env.NODE_ENV === 'test' ? () => true : undefined, // Skip throttling in test environment
  }),
);

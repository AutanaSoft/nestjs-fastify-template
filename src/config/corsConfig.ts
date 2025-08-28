import { FastifyCorsOptions } from '@fastify/cors';
import { registerAs } from '@nestjs/config';

// Normalize and clean origin whitelist
const originWhitelist = (process.env.CORS_ORIGIN_WHITELIST ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(s => s.length > 0);

// Default allowed headers include Sentry tracing headers
const DEFAULT_ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'Accept',
  'Origin',
  'X-Requested-With',
  'X-Correlation-Id',
  'sentry-trace',
  'baggage',
] as const;

// Merge env-provided headers with defaults (deduped)
const envAllowedHeaders = (process.env.CORS_ALLOWED_HEADERS ?? '')
  .split(',')
  .map(h => h.trim())
  .filter(h => h.length > 0);

const allowedHeaders = Array.from(
  new Set<string>([...DEFAULT_ALLOWED_HEADERS, ...envAllowedHeaders]),
);

export default registerAs(
  'corsConfig',
  (): FastifyCorsOptions => ({
    origin: (origin, callback) => {
      // In non-production, allow any origin if whitelist is empty
      if (process.env.NODE_ENV !== 'production' && originWhitelist.length === 0) {
        return callback(null, true);
      }

      // Permite solicitudes sin origen (como Postman) y las que están en la lista blanca.
      if (!origin || originWhitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Rechaza cualquier otro origen.
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Se necesita `true` para que la lista blanca de orígenes funcione correctamente.
    allowedHeaders,
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS || 'X-Total-Count,X-Correlation-Id',
  }),
);

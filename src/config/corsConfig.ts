import { FastifyCorsOptions } from '@fastify/cors';
import { registerAs } from '@nestjs/config';

// Lee la lista blanca de orígenes desde una variable de entorno.
// Ejemplo: CORS_ORIGIN_WHITELIST=https://app.example.com,http://localhost:3000
const originWhitelist = (process.env.CORS_ORIGIN_WHITELIST || '').split(',');

export default registerAs(
  'corsConfig',
  (): FastifyCorsOptions => ({
    origin: (origin, callback) => {
      // En desarrollo, si la lista blanca está vacía, permite cualquier origen.
      if (
        process.env.NODE_ENV !== 'production' &&
        originWhitelist.length === 1 &&
        originWhitelist[0] === ''
      ) {
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
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Se necesita `true` para que la lista blanca de orígenes funcione correctamente.
    allowedHeaders:
      process.env.CORS_ALLOWED_HEADERS ||
      'Content-Type,Authorization,Accept,Origin,X-Requested-With,X-Correlation-Id',
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS || 'X-Total-Count,X-Correlation-Id',
  }),
);

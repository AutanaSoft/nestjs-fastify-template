import { FastifyHelmetOptions } from '@fastify/helmet';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'helmetConfig',
  (): FastifyHelmetOptions => ({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'app.satismeter.com',
          'satismeter.com',
          'cdn.launchdarkly.com', // Allow LaunchDarkly JS SDK
        ],
        scriptSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'app.satismeter.com',
          'satismeter.com',
          'cdn.launchdarkly.com', // Allow LaunchDarkly JS SDK in <script> tags
        ],
        // Allow LaunchDarkly network endpoints (events + streaming + app)
        connectSrc: [
          "'self'",
          'https://events.launchdarkly.com',
          'https://clientstream.launchdarkly.com',
          'https://app.launchdarkly.com',
          'https://cdn.launchdarkly.com',
        ],
        // ...otras directivas existentes...
      },
    },
    // ...cualquier otra configuración existente...
  }),
);

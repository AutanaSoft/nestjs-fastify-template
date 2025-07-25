import { FastifyCookieOptions } from '@fastify/cookie';
import { registerAs } from '@nestjs/config';

/**
 * @function getSameSite
 * @description
 * Retrieves the SameSite attribute for cookies from environment variables.
 * It validates the `COOKIE_SAME_SITE` variable against allowed values ('lax', 'none', 'strict').
 * If the variable is not set or invalid, it defaults to 'lax' for production and 'none' otherwise.
 * @returns {'lax' | 'none' | 'strict' | undefined} The determined SameSite value.
 */
const getSameSite = (): 'lax' | 'none' | 'strict' | undefined => {
  const allowedSameSite = ['lax', 'none', 'strict'];
  const sameSite = process.env.COOKIE_SAME_SITE;

  // Check if the environment variable is set and valid
  if (sameSite && allowedSameSite.includes(sameSite)) {
    return sameSite as 'lax' | 'none' | 'strict';
  }

  // If not set or invalid, default to 'lax' for production and 'none' otherwise
  return process.env.APP_ENV === 'production' ? 'lax' : 'none';
};

/**
 * Exports the configuration for the `@fastify/cookie` plugin, registered under the `cookieConfig` key.
 * This setup allows for secure and properly configured cookies based on the application's environment.
 *
 * It relies on the following environment variables:
 * - `APP_ENV`: Determines if the environment is 'production' to enable secure settings.
 * - `COOKIE_SECRET`: A secret string for signing cookies.
 * - `COOKIE_HTTP_ONLY`: If 'true', sets the `httpOnly` flag on cookies.
 * - `COOKIE_SAME_SITE`: Sets the `SameSite` attribute ('lax', 'none', 'strict').
 * - `COOKIE_DOMAIN`: Sets the `domain` for the cookies.
 *
 * @returns {FastifyCookieOptions} A configuration object for `@fastify/cookie`.
 */
export default registerAs('cookieConfig', (): FastifyCookieOptions => {
  const isProduction = process.env.APP_ENV === 'production';
  const secret = process.env.COOKIE_SECRET || 'MAw5YjhDo8QZoTnuvXlsZwnPvfkynQmUWQjnQIyeoPs=';
  const isHttpOnly = process.env.COOKIE_HTTP_ONLY === 'true';

  return {
    secret,
    hook: 'onRequest',
    parseOptions: {
      secure: isProduction,
      httpOnly: isHttpOnly,
      sameSite: getSameSite(),
      path: '/',
      signed: isProduction,
      domain: process.env.COOKIE_DOMAIN, // Optional domain setting
    },
  };
});

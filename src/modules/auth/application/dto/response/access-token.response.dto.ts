import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Authentication response DTO for GraphQL API.
 *
 * This DTO represents the response structure for authentication operations including login,
 * token refresh, and registration. It encapsulates both access and refresh tokens along with
 * their temporal metadata to enable secure JWT-based authentication flows.
 *
 * The response follows JWT best practices by providing short-lived access tokens with longer-lived
 * refresh tokens, enabling secure token rotation and session management in the application.
 *
 * @since 1.0.0
 */
@ObjectType('AuthResponse')
export class AuthResponse {
  /**
   * JWT access token for API authentication.
   *
   * Short-lived token (typically 2 hours) used for authenticating API requests.
   * Should be included in the Authorization header as a Bearer token for protected endpoints.
   */
  @Field(() => String, { description: 'JWT access token for API authentication' })
  token: string;

  /**
   * JWT refresh token for token renewal.
   *
   * Long-lived token (typically 7 days) used exclusively for obtaining new access tokens
   * when the current access token expires. Should be stored securely and used only
   * for token refresh operations.
   */
  @Field(() => String, { description: 'JWT refresh token for token renewal' })
  refreshToken: string;

  /**
   * Access token expiration timestamp.
   *
   * ISO 8601 timestamp indicating when the access token will expire and need to be refreshed.
   * Clients should monitor this timestamp and refresh tokens before expiration to maintain
   * uninterrupted access to protected resources.
   */
  @Field(() => Date, { description: 'Access token expiration timestamp' })
  expiresAt: Date;

  /**
   * Authentication session creation timestamp.
   *
   * ISO 8601 timestamp indicating when the authentication session was established.
   * Useful for audit logging, session tracking, and security monitoring purposes.
   */
  @Field(() => Date, { description: 'Authentication session creation timestamp' })
  createdAt: Date;
}

import { UserEntity } from '@/modules/user/domain/entities';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { TokenPair, JwtPayload, TempTokenPayload, JwtTempTokenType } from '../types';

/**
 * Abstract repository interface for token management operations
 * This repository defines the contract for JWT and refresh token operations
 */
export abstract class TokenRepository {
  /**
   * Generates a new JWT access token for the given user payload
   * @param payload - JWT payload containing user information
   * @returns Promise resolving to the generated JWT token string
   */
  abstract generateAccessToken(payload: JwtPayload): Promise<string>;

  /**
   * Generates a temporary JWT token for specific actions (password recovery, email verification, etc.)
   * @param user - The user entity for whom the token is being generated
   * @param type - The type of temporary token being generated
   * @returns Promise resolving to the generated temporary JWT token string
   */
  abstract generateTempToken(user: UserEntity, type: JwtTempTokenType): Promise<string>;

  /**
   * Validates a temporary JWT token and ensures it's of the expected type
   * @param token - The temporary JWT token string to validate
   * @param expectedType - The expected token type for validation
   * @returns Promise resolving to the decoded payload if valid and of correct type
   * @throws InvalidTokenDomainException if token is invalid
   * @throws TokenExpiredDomainException if token has expired
   */
  abstract validateTempToken(
    token: string,
    expectedType: JwtTempTokenType,
  ): Promise<TempTokenPayload>;

  /**
   * Generates a new refresh token for the given user
   * @param userId - The unique identifier of the user
   * @returns Promise resolving to the refresh token entity
   */
  abstract generateRefreshToken(userId: string): Promise<RefreshTokenEntity>;

  /**
   * Generates both access and refresh tokens for a user
   * @param payload - JWT payload containing user information
   * @returns Promise resolving to a token pair with access token, refresh token, and metadata
   */
  abstract generateTokenPair(payload: JwtPayload): Promise<TokenPair>;

  /**
   * Validates and verifies a JWT access token
   * @param token - The JWT token string to validate
   * @returns Promise resolving to the decoded payload if valid, null if invalid
   */
  abstract validateAccessToken(token: string): Promise<JwtPayload | null>;

  /**
   * Validates a refresh token and returns its entity if valid
   * @param token - The refresh token string to validate
   * @returns Promise resolving to the refresh token entity if valid, null if invalid
   */
  abstract validateRefreshToken(token: string): Promise<RefreshTokenEntity | null>;

  /**
   * Revokes a refresh token, making it invalid for future use
   * @param token - The refresh token string to revoke
   * @returns Promise resolving when the token has been revoked
   */
  abstract revokeRefreshToken(token: string): Promise<void>;

  /**
   * Revokes all refresh tokens for a specific user (useful for sign-out from all devices)
   * @param userId - The unique identifier of the user
   * @returns Promise resolving when all tokens have been revoked
   */
  abstract revokeAllUserTokens(userId: string): Promise<void>;

  /**
   * Refreshes an access token using a valid refresh token
   * @param refreshToken - The refresh token string
   * @returns Promise resolving to a new token pair if successful, null if the refresh token is invalid
   */
  abstract refreshAccessToken(refreshToken: string): Promise<TokenPair | null>;

  /**
   * Stores a refresh token in the persistence layer
   * @param refreshToken - The refresh token entity to store
   * @returns Promise resolving to the stored refresh token entity
   */
  abstract storeRefreshToken(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity>;

  /**
   * Finds a refresh token by its token string
   * @param token - The refresh token string to find
   * @returns Promise resolving to the refresh token entity if found, null otherwise
   */
  abstract findRefreshToken(token: string): Promise<RefreshTokenEntity | null>;
}

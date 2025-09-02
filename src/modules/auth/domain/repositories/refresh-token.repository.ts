import { RefreshTokenEntity } from '../entities';

/**
 * Abstract repository interface for refresh token persistence operations
 * This repository defines the contract for basic CRUD operations on refresh tokens
 * Business logic and validations should be handled in domain services or use cases
 */
export abstract class RefreshTokenRepository {
  /**
   * Creates a new unique identifier for a refresh token
   * @returns Promise resolving to the new refresh token identifier
   */
  abstract generateSubId(): Promise<string>;

  /**
   * Creates a new refresh token in the persistence layer
   * @param refreshToken - The refresh token entity to create
   * @returns Promise resolving to the created refresh token entity
   */
  abstract create(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity>;

  /**
   * Finds a refresh token by its unique identifier
   * @param id - The unique identifier of the refresh token
   * @returns Promise resolving to the refresh token entity if found, null otherwise
   */
  abstract findById(id: string): Promise<RefreshTokenEntity | null>;

  /**
   * Finds a refresh token by its token hash
   * @param tokenHash - The SHA-256 hash of the refresh token to find
   * @returns Promise resolving to the refresh token entity if found, null otherwise
   */
  abstract findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null>;

  /**
   * Finds all refresh tokens for a specific user
   * @param userId - The unique identifier of the user
   * @returns Promise resolving to array of refresh token entities for the user
   */
  abstract findByUserId(userId: string): Promise<RefreshTokenEntity[]>;

  /**
   * Updates an existing refresh token
   * @param id - The unique identifier of the refresh token to update
   * @param refreshToken - The refresh token entity with updated data
   * @returns Promise resolving to the updated refresh token entity
   */
  abstract update(
    id: string,
    refreshToken: Partial<RefreshTokenEntity>,
  ): Promise<RefreshTokenEntity>;

  /**
   * Updates multiple refresh tokens that match the given criteria
   * @param where - The criteria to match tokens for update
   * @param data - The data to update
   * @returns Promise resolving to the number of tokens updated
   */
  abstract updateMany(
    where: { userId?: string; tokenHash?: string; revokedAt?: Date | null },
    data: Partial<RefreshTokenEntity>,
  ): Promise<number>;
}

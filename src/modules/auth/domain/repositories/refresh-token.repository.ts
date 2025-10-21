import { RefreshTokenEntity } from '../entities';
import { RefreshTokenUpdateData } from '../types';

/**
 * Abstract repository for managing refresh token persistence.
 *
 * This interface defines the contract for all persistence operations related to
 * refresh tokens, ensuring a clean separation between the domain and infrastructure layers.
 * It follows the Dependency Inversion Principle by allowing domain logic to depend on
 * this abstraction rather than concrete implementations.
 */
export abstract class RefreshTokenRepository {
  /**
   * Generates a new, unique identifier for a refresh token entity.
   * This ensures that each token has a primary key before being persisted.
   *
   * @returns A promise that resolves to a unique identifier string.
   */
  abstract generateId(): Promise<string>;

  /**
   * Persists a new refresh token entity.
   *
   * This method takes a fully constructed `RefreshTokenEntity` and saves it to the
   * underlying data store. It's the primary way to introduce a new token into the system.
   *
   * @param refreshToken The `RefreshTokenEntity` instance to create.
   * @returns A promise that resolves to the created `RefreshTokenEntity`.
   */
  abstract create(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity>;

  /**
   * Finds a refresh token by its unique identifier.
   *
   * @param id The unique identifier of the refresh token.
   * @returns A promise that resolves to the `RefreshTokenEntity` if found, otherwise `null`.
   */
  abstract findById(id: string): Promise<RefreshTokenEntity | null>;

  /**
   * Finds a refresh token by its token hash.
   * The hash is used to prevent storing raw tokens, enhancing security.
   *
   * @param tokenHash The SHA-256 hash of the refresh token.
   * @returns A promise that resolves to the `RefreshTokenEntity` if found, otherwise `null`.
   */
  abstract findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null>;

  /**
   * Retrieves all refresh tokens associated with a specific user.
   * This is useful for scenarios like displaying all active sessions for a user.
   *
   * @param userId The unique identifier of the user.
   * @returns A promise that resolves to an array of `RefreshTokenEntity` instances.
   */
  abstract findByUserId(userId: string): Promise<RefreshTokenEntity[]>;

  /**
   * Updates an existing refresh token.
   *
   * This method is designed to be restrictive, only allowing updates defined in
   * the `RefreshTokenUpdateData` type, such as revoking a token.
   *
   * @param params An object containing the token `id` and the data to update.
   * @returns A promise that resolves to the updated `RefreshTokenEntity`.
   */
  abstract update(params: RefreshTokenUpdateData): Promise<RefreshTokenEntity>;

  /**
   * Revokes all active refresh tokens for a specific user.
   *
   * This is a critical security operation, typically used when a user changes their
   * password or requests to sign out from all devices. It ensures that all existing
   * sessions are invalidated.
   *
   * @param userId The unique identifier of the user whose tokens will be revoked.
   * @returns A promise that resolves to the number of tokens that were revoked.
   */
  abstract revokeAllByUserId(userId: string): Promise<number>;
}

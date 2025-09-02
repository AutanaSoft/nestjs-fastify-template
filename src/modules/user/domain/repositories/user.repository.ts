import { PaginatedData } from '@/shared/domain/types';
import { UserEntity } from '../entities/user.entity';
import { UserCreateData, UserFindAllPaginateData, UserUpdateData } from '../types';

/**
 * Abstract repository interface for user data persistence operations
 * This repository defines the contract that must be implemented by infrastructure adapters
 */
export abstract class UserRepository {
  /**
   * Creates a new user in the data store
   * @param data - User creation data containing required and optional fields
   * @returns Promise resolving to the created user entity
   */
  abstract create(data: UserCreateData): Promise<UserEntity>;

  /**
   * Updates an existing user in the data store
   * @param id - The unique identifier of the user to update
   * @param data - Partial user data containing fields to be updated
   * @returns Promise resolving to the updated user entity
   */
  abstract update(id: string, data: UserUpdateData): Promise<UserEntity>;

  /**
   * Finds a user by their unique identifier
   * @param id - The unique identifier of the user to find
   * @returns Promise resolving to the user entity if found, null otherwise
   */
  abstract findById(id: string): Promise<UserEntity | null>;

  /**
   * Finds a user by their email address
   * @param email - The email address to search for
   * @returns Promise resolving to the user entity if found, null otherwise
   */
  abstract findByEmail(email: string): Promise<UserEntity | null>;

  /**
   * Finds a user by their username
   * @param userName - The username to search for
   * @returns Promise resolving to the user entity if found, null otherwise
   */
  abstract findByUserName(userName: string): Promise<UserEntity | null>;

  /**
   * Retrieves paginated users based on filter, sort, and pagination criteria
   * @param params - Query parameters including skip, take, optional filters and sorting options
   * @returns Promise resolving to paginated data with minimal metadata for use case processing
   */
  abstract findAllPaginated(params: UserFindAllPaginateData): Promise<PaginatedData<UserEntity>>;
}

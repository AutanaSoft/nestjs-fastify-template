import { UserEntity } from '../entities/user.entity';
import { UserCreateData, UserFindAllData } from '../types';

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
   * Retrieves all users based on filter and sort criteria
   * @param params - Query parameters including optional filters and sorting options
   * @returns Promise resolving to an array of user entities matching the criteria
   */
  abstract findAll(params: UserFindAllData): Promise<UserEntity[]>;
}

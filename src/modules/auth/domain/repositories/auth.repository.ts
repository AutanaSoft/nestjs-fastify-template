import { UserEntity } from '@/modules/user/domain/entities';
import { AuthCredentials, UserRegistrationData } from '../types';

/**
 * Abstract repository interface for authentication operations
 * This repository defines the contract for user authentication and credential validation
 */
export abstract class AuthRepository {
  /**
   * Validates user credentials for sign-in process
   * @param credentials - Authentication credentials containing identifier (email or username) and password
   * @returns Promise resolving to the authenticated user entity if credentials are valid, null if invalid
   */
  abstract validateCredentials(credentials: AuthCredentials): Promise<UserEntity | null>;

  /**
   * Registers a new user in the system
   * @param registrationData - User registration data containing email, username, and password
   * @returns Promise resolving to the created user entity
   * @throws Error if email or username already exists
   */
  abstract registerUser(registrationData: UserRegistrationData): Promise<UserEntity>;

  /**
   * Finds a user by email address
   * Used for duplicate email validation during registration
   * @param email - The email address to search for
   * @returns Promise resolving to the user entity if found, null otherwise
   */
  abstract findUserByEmail(email: string): Promise<UserEntity | null>;

  /**
   * Finds a user by username
   * Used for duplicate username validation during registration
   * @param userName - The username to search for
   * @returns Promise resolving to the user entity if found, null otherwise
   */
  abstract findUserByUserName(userName: string): Promise<UserEntity | null>;

  /**
   * Finds a user by their unique identifier
   * @param id - The unique identifier of the user to find
   * @returns Promise resolving to the user entity if found, null otherwise
   */
  abstract findUserById(id: string): Promise<UserEntity | null>;
}

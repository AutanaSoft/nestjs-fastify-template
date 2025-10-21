import { UserEntity } from '@/modules/user/domain/entities';
import { AuthSignUpData } from '../types';

/**
 * Abstract repository interface for authentication operations following hexagonal architecture principles.
 *
 * This repository defines the contract for user authentication and credential validation.
 * It serves as a port in the hexagonal architecture, providing a stable interface
 * that can be implemented by different adapters (Prisma, MongoDB, etc.).
 */
export abstract class AuthRepository {
  /**
   * Registers a new user in the system with validation for unique constraints.
   *
   * This method handles the complete user registration process including:
   * - Email uniqueness validation
   * - Username uniqueness validation
   * - Password hashing (handled by domain service)
   * - User entity creation with default values
   *
   * @param params - User registration data containing email, username, and password
   * @param params.email - User's email address (must be unique across the system)
   * @param params.userName - User's chosen username (must be unique across the system)
   * @param params.password - Plain text password (will be hashed before storage)
   *
   * @returns Promise resolving to the newly created user entity with generated ID and timestamps
   *
   * @throws {EmailAlreadyExistsDomainException} When the email is already registered
   * @throws {UsernameAlreadyExistsDomainException} When the username is already taken
   * @throws {Error} For unexpected database errors during user creation
   */
  abstract register(params: AuthSignUpData): Promise<UserEntity>;

  /**
   * Finds a user by email address or username for authentication and validation purposes.
   *
   * This method supports flexible user lookup using either email or username,
   * enabling multiple authentication strategies. It's used for:
   * - User authentication during sign-in
   * - Duplicate validation during registration
   * - User existence checks
   *
   * @param emailOrUserName - The email address or username to search for
   *
   * @returns Promise resolving to:
   *   - UserEntity if a user is found with the given email or username
   *   - null if no user exists with the provided identifier
   */
  abstract findUser(emailOrUserName: string): Promise<UserEntity | null>;
}

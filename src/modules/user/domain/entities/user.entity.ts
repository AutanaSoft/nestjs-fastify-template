import { UserRole, UserStatus } from '../enums/user.enums';

/**
 * Domain entity representing a user in the system.
 * Contains all user-related data and business logic at the domain level.
 * This entity is framework-agnostic and contains pure business rules.
 */
export class UserEntity {
  /**
   * Unique identifier for the user.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;

  /**
   * User's email address. Must be unique across the system.
   * Used for authentication and communication purposes.
   * @example "user@example.com"
   */
  email: string;

  /**
   * User's hashed password for authentication.
   * Should never be stored in plain text.
   * @example "$2b$10$..."
   */
  password: string;

  /**
   * Display name chosen by the user.
   * Used for identification within the application.
   * @example "john_doe"
   */
  userName: string;

  /**
   * Current status of the user account.
   * Determines if the user can access the system.
   */
  status: UserStatus;

  /**
   * Role assigned to the user.
   * Determines the permissions and access levels within the system.
   */
  role: UserRole;

  /**
   * Timestamp when the user account was created.
   * @example new Date('2023-01-01T00:00:00Z')
   */
  createdAt: Date;

  /**
   * Timestamp when the user account was last updated.
   * @example new Date('2023-01-15T10:30:00Z')
   */
  updatedAt: Date;
}

import { HashUtils } from '@shared/infrastructure/utils';
import { UserRole, UserStatus } from '@modules/user/domain/enums/user.enums';

/**
 * Authentication domain entity extending user functionality with auth-specific methods.
 * Contains all user-related data and authentication business logic at the domain level.
 * This entity is framework-agnostic and contains pure authentication business rules.
 */
export class AuthEntity {
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
   * @example "$2b$12$..."
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

  /**
   * Hashes a plain text password using bcrypt.
   * This method updates the password property with the hashed value.
   * @param plainPassword - The plain text password to hash
   * @returns Promise<void>
   * @example
   * ```typescript
   * const authUser = new AuthEntity();
   * await authUser.hashPassword('myPlainPassword');
   * console.log(authUser.password); // "$2b$12$..."
   * ```
   */
  async hashPassword(plainPassword: string): Promise<void> {
    this.password = await HashUtils.hashPassword(plainPassword);
  }

  /**
   * Verifies if a plain text password matches the stored hashed password.
   * @param plainPassword - The plain text password to verify
   * @returns Promise<boolean> - True if the password matches, false otherwise
   * @example
   * ```typescript
   * const authUser = new AuthEntity();
   * authUser.password = '$2b$12$hashedPassword...';
   * const isValid = await authUser.verifyPassword('plainPassword');
   * console.log(isValid); // true or false
   * ```
   */
  async verifyPassword(plainPassword: string): Promise<boolean> {
    return HashUtils.comparePassword(plainPassword, this.password);
  }

  /**
   * Checks if the user account is active and can access the system.
   * A user is considered active if their status is ACTIVE.
   * @returns boolean - True if the user status is ACTIVE, false otherwise
   * @example
   * ```typescript
   * const authUser = new AuthEntity();
   * authUser.status = UserStatus.ACTIVE;
   * console.log(authUser.isActive()); // true
   *
   * authUser.status = UserStatus.BANNED;
   * console.log(authUser.isActive()); // false
   * ```
   */
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * Checks if the user account is banned from the system.
   * @returns boolean - True if the user status is BANNED, false otherwise
   * @example
   * ```typescript
   * const authUser = new AuthEntity();
   * authUser.status = UserStatus.BANNED;
   * console.log(authUser.isBanned()); // true
   * ```
   */
  isBanned(): boolean {
    return this.status === UserStatus.BANNED;
  }

  /**
   * Checks if the user account is inactive (temporarily disabled).
   * @returns boolean - True if the user status is INACTIVE, false otherwise
   * @example
   * ```typescript
   * const authUser = new AuthEntity();
   * authUser.status = UserStatus.INACTIVE;
   * console.log(authUser.isInactive()); // true
   * ```
   */
  isInactive(): boolean {
    return this.status === UserStatus.INACTIVE;
  }

  /**
   * Checks if the user has completed the registration process.
   * A user is considered registered but not yet activated if their status is REGISTERED.
   * @returns boolean - True if the user status is REGISTERED, false otherwise
   * @example
   * ```typescript
   * const authUser = new AuthEntity();
   * authUser.status = UserStatus.REGISTERED;
   * console.log(authUser.isRegistered()); // true
   * ```
   */
  isRegistered(): boolean {
    return this.status === UserStatus.REGISTERED;
  }

  /**
   * Comprehensive check to determine if the user can authenticate.
   * A user can authenticate if they are active (not banned, inactive, or just registered).
   * @returns boolean - True if the user can authenticate, false otherwise
   * @example
   * ```typescript
   * const authUser = new AuthEntity();
   * authUser.status = UserStatus.ACTIVE;
   * console.log(authUser.canAuthenticate()); // true
   *
   * authUser.status = UserStatus.BANNED;
   * console.log(authUser.canAuthenticate()); // false
   * ```
   */
  canAuthenticate(): boolean {
    return this.isActive();
  }

  /**
   * Checks if the user has administrative privileges.
   * @returns boolean - True if the user role is ADMIN, false otherwise
   * @example
   * ```typescript
   * const authUser = new AuthEntity();
   * authUser.role = UserRole.ADMIN;
   * console.log(authUser.isAdmin()); // true
   * ```
   */
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Checks if the user has regular user privileges.
   * @returns boolean - True if the user role is USER, false otherwise
   * @example
   * ```typescript
   * const authUser = new AuthEntity();
   * authUser.role = UserRole.USER;
   * console.log(authUser.isUser()); // true
   * ```
   */
  isUser(): boolean {
    return this.role === UserRole.USER;
  }
}

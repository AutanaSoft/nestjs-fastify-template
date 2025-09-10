import { UserRole, UserStatus } from '../enums/user.enums';
import { UserEntityData } from '../types/user.types';

/**
 * Domain entity representing a user in the system.
 *
 * This class encapsulates all user-related data and business logic at the domain level.
 * It defines the fundamental properties such as email, password, username, status, and role
 * that determine the user's identity and capabilities within the system.
 *
 * As part of the domain layer in hexagonal architecture, this entity serves as the central
 * business object that use cases interact with. It maintains complete independence from
 * external infrastructure concerns and defines the core business model for users.
 *
 * The entity enforces business invariants through its constructor and provides a consistent
 * representation of user data throughout the application domain.
 */
export class UserEntity {
  /**
   * Unique identifier for the user (UUID).
   */
  readonly id: string;

  /**
   * User's email address. Must be unique and used for authentication.
   */
  readonly email: string;

  /**
   * User's hashed password for authentication.
   */
  readonly password: string;

  /**
   * User-chosen display name. Must be unique within the system.
   */
  readonly userName: string;

  /**
   * Current status of the user account.
   */
  readonly status: UserStatus;

  /**
   * Role assigned to the user, determining permissions and capabilities.
   */
  readonly role: UserRole;

  /**
   * Date and time when the user account was created.
   */
  readonly createdAt: Date;

  /**
   * Date and time of the last account update.
   */
  readonly updatedAt: Date;

  /**
   * Creates a new UserEntity instance with the provided properties.
   *
   * This constructor implements an initialization pattern through a complete properties object,
   * following the immutability principle for domain entities. All necessary data must be
   * provided at the time of creation to ensure entity consistency and completeness.
   *
   * Within the hexagonal architecture context, this constructor is primarily invoked by
   * repository adapters when hydrating entities from persistence, and by use cases when
   * creating new entity instances.
   *
   * The constructor performs no validation as it assumes the data has already been validated
   * by the calling use case or adapter. This maintains the separation of concerns between
   * validation logic and entity creation.
   *
   * @param props Object containing all required user properties as defined in UserEntityData
   */
  constructor(props: UserEntityData) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.userName = props.userName;
    this.status = props.status;
    this.role = props.role;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

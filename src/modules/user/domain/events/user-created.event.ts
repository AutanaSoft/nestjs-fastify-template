import { DomainEvent } from '@/shared/domain/interfaces';
import { UserEntity } from '../entities/user.entity';

/**
 * Domain event emitted when a new user is created in the system
 * Contains user data and relevant metadata for event handling
 * This event can be used by other bounded contexts to react to user creation
 */
export class UserCreatedEvent implements DomainEvent {
  /**
   * Name of the event for identification in event handlers
   */
  public readonly name = 'user.created';

  /**
   * Timestamp when the event was created
   */
  public readonly createdAt: Date;

  /**
   * The user entity data that was created
   */
  public readonly user: UserEntity;

  /**
   * Creates a new UserCreatedEvent instance
   * @param user The created user entity data
   */
  constructor(user: UserEntity) {
    this.user = user;
    this.createdAt = new Date();
  }
}

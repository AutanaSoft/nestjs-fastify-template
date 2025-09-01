import { UserCreatedEvent } from '@modules/user/domain/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';

/**
 * Event handler for user-related domain events
 * Contains handlers for different user domain events
 */
@Injectable()
export class UserEventHandler {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(UserEventHandler.name);
  }

  /**
   * Handles the UserCreatedEvent
   * Triggered when a new user is created in the system
   * Can be used for side effects like sending welcome emails, notifications, etc.
   *
   * @param event The user created event containing user data
   */
  @OnEvent('user.created')
  handleUserCreatedEvent(event: UserCreatedEvent): void {
    this.logger.assign({
      event: event.name,
      userId: event.user.id,
      email: event.user.email,
    });

    this.logger.info('User created event received');

    // Here you can implement side effects that should happen when a user is created
    // For example:
    // 1. Send welcome email
    // 2. Create default user settings
    // 3. Initialize user resources
    // 4. Add to analytics/monitoring
    // 5. Trigger external integrations

    // Example of a simulated welcome email
    this.logger.info(`Welcome email would be sent to: ${event.user.email}`);

    // Example of initializing user settings
    this.logger.info(`Default preferences would be created for user: ${event.user.id}`);

    this.logger.info('User created event handled successfully');
  }
}

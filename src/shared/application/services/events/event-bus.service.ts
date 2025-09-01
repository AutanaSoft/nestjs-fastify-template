import { DomainEvent } from '@/shared/domain/interfaces';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';

/**
 * Application service for dispatching domain events
 * Acts as a mediator between domain events and infrastructure event handlers
 */
@Injectable()
export class EventBusService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(EventBusService.name);
  }

  /**
   * Publishes a domain event to all subscribers
   * @param event The domain event to publish
   */
  publish<T extends DomainEvent>(event: T): void {
    this.logger.assign({
      eventCreate: {
        eventName: event.name,
        createdAt: event.createdAt,
      },
    });

    this.logger.debug(`Publishing domain event: ${event.name}`);
    this.eventEmitter.emit(event.name, event);
  }

  /**
   * Publishes multiple domain events in sequence
   * @param events Array of domain events to publish
   */
  publishAll(events: DomainEvent[]): void {
    events.forEach(event => this.publish(event));
  }
}

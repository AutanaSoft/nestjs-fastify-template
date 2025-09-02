/**
 * Base interface for all domain events in the system
 * Defines the contract that all domain events must implement
 */
export interface DomainEvent {
  /**
   * Name of the event, used for identification and routing
   */
  readonly name: string;

  /**
   * Timestamp when the event was created
   */
  readonly createdAt: Date;
}

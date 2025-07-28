import { CorrelationService } from '@/shared/application/services';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';

/**
 * Middleware to handle correlation IDs for request tracing.
 *
 * It retrieves the 'x-correlation-id' from the request headers or generates
 * a new one if not provided. The ID is then stored using the CorrelationService
 * and added to the response headers.
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly correlationService: CorrelationService) {}

  /**
   * Executes the middleware logic.
   *
   * @param req - The incoming Fastify request
   * @param res - The outgoing Fastify reply, as a raw ServerResponse
   * @param next - The next function in the middleware chain
   */
  use(req: FastifyRequest, res: ServerResponse, next: () => void): void {
    this.correlationService.run(() => {
      const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();
      console.log('Setting correlation ID:', correlationId);
      this.correlationService.set('correlationId', correlationId);

      res.setHeader('x-correlation-id', correlationId);
      next();
    });
  }
}

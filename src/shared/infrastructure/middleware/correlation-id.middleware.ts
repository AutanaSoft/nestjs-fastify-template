import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

export const X_CORRELATION_ID = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(
    req: FastifyRequest['raw'] & { correlationId?: string },
    res: FastifyReply['raw'],
    next: () => void,
  ): void {
    // Get existing correlation ID from headers
    const correlationId = req.id as string;

    // Set the correlation ID in headers and request for future use
    req.headers[X_CORRELATION_ID] = correlationId;
    req.correlationId = correlationId;
    res.setHeader(X_CORRELATION_ID, correlationId);

    next();
  }
}

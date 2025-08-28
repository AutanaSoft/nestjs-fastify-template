import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';

export const X_CORRELATION_ID = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(
    request: FastifyRequest['raw'] & { correlationId: string },
    reply: FastifyReply['raw'],
    next: () => void,
  ): void {
    const existingCorrelationId = request.headers[X_CORRELATION_ID] as string | undefined;
    const correlationId = existingCorrelationId || randomUUID();

    // Establece el correlationId en los headers y el request
    request.headers[X_CORRELATION_ID] = correlationId;
    request.correlationId = correlationId;
    reply.setHeader(X_CORRELATION_ID, correlationId);

    next();
  }
}

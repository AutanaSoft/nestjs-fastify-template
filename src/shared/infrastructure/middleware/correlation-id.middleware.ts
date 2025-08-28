import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';

const HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(
    request: FastifyRequest['raw'] & { correlationId: string },
    reply: FastifyReply['raw'],
    next: () => void,
  ): void {
    const requestId = request.headers[HEADER] as string | undefined;
    const replyId = reply.getHeader(HEADER) as string | undefined;
    const correlationId = requestId || replyId || randomUUID();

    // Establece el correlationId en los headers y el request
    request.headers[HEADER] = correlationId;
    request.correlationId = correlationId;
    reply.setHeader(HEADER, correlationId);

    next();
  }
}

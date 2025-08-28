import { CorrelationService } from '@/shared/application/services';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';

const HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly correlationService: CorrelationService) {}

  use(request: FastifyRequest['raw'], reply: FastifyReply['raw'], next: () => void): void {
    const requestID = request.headers[HEADER] as string | undefined;
    const replyID = reply.getHeader(HEADER) as string | undefined;
    const correlationId = requestID || replyID || randomUUID();

    // Envía el header lo antes posible para asegurar su presencia en cualquier respuesta
    request.headers[HEADER] = correlationId;
    reply.setHeader(HEADER, correlationId);

    // Ejecuta el resto de la request dentro del contexto (ALS) del correlationId
    this.correlationService.run(correlationId, () => next());
  }
}

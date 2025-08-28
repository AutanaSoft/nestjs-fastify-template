import { CorrelationService } from '@/shared/application/services';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';

const HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly correlationService: CorrelationService) {}

  use(request: FastifyRequest['raw'], reply: FastifyReply['raw'], next: () => void): void {
    // 1) Intake del header si viene; 2) fallback a request.id de Fastify; 3) genera UUID
    const headerId = request.headers[HEADER] as string | undefined;
    const correlationId = headerId ?? randomUUID();

    // Envía el header lo antes posible para asegurar su presencia en cualquier respuesta
    reply.setHeader(HEADER, correlationId);

    // Ejecuta el resto de la request dentro del contexto (ALS) del correlationId
    this.correlationService.run(correlationId, () => {
      next();
    });
  }
}

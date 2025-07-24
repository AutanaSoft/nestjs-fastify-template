import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable, tap } from 'rxjs';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  private static readonly CORRELATION_ID_HEADER = 'x-correlation-id';

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request: FastifyRequest = ctx.getRequest();
    const response: FastifyReply = ctx.getResponse();

    // Get existing correlation ID from header or generate a new one
    const headers = request.headers || {};
    const headerValue = headers[CorrelationIdInterceptor.CORRELATION_ID_HEADER];
    const correlationId =
      (Array.isArray(headerValue) ? headerValue[0] : headerValue) || crypto.randomUUID();

    // Ensure the header is set for logging (if not already present)
    if (!headerValue) {
      // Ensure headers object exists
      if (!request.headers) {
        request.headers = {};
      }
      request.headers[CorrelationIdInterceptor.CORRELATION_ID_HEADER] = correlationId;
    }

    return next.handle().pipe(
      tap(() => {
        // Set the correlation ID in the response header after successful processing
        if (!response.sent) {
          response.header(CorrelationIdInterceptor.CORRELATION_ID_HEADER, correlationId);
        }
      }),
    );
  }
}

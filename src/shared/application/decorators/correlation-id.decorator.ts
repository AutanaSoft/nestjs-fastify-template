import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';

/**
 * Decorator to extract correlation ID from the request
 * The correlation ID is stored in the request.id property by Fastify
 */
export const CorrelationId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    // Check if it's a GraphQL context
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getType() === 'graphql') {
      const { req } = gqlContext.getContext<{ req: FastifyRequest }>();
      return req.id;
    }

    // For REST endpoints
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    return request.id;
  },
);

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PinoLogger } from 'nestjs-pino';

import { UnauthorizedError } from '@/shared/domain/errors';
import { TokenRepository } from '../../domain/repositories';
import { JwtPayload } from '../../domain/types';

/**
 * Metadata key for marking routes as public (skipping authentication)
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Extended Request interface to include user information
 */
interface AuthenticatedRequest {
  user?: JwtPayload;
  headers: {
    authorization?: string;
  };
}

/**
 * Authentication guard that validates JWT tokens for protected routes
 * Implements the standard NestJS CanActivate interface
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly reflector: Reflector,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthGuard.name);
  }

  /**
   * Determines if the current request should be allowed to proceed
   * @param context - Execution context containing request information
   * @returns Promise<boolean> - true if request is authorized, throws exception otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const logger = this.logger;
    logger.assign({ method: 'canActivate' });

    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      logger.debug('Route marked as public, skipping authentication');
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      logger.warn('No token provided in request');
      throw new UnauthorizedError('Authentication token is required');
    }

    try {
      // Validate the JWT token
      const payload = await this.tokenRepository.validateAccessToken(token);

      if (!payload) {
        logger.warn('Token validation returned null payload');
        throw new UnauthorizedError('Invalid authentication token');
      }

      // Attach the user payload to the request object
      // This makes the user information available in route handlers
      request.user = payload;

      logger.debug(
        { userId: payload.sub, email: payload.user?.email },
        'User successfully authenticated',
      );

      return true;
    } catch (error: unknown) {
      // Log the authentication failure
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn({ error: errorMessage }, 'Authentication failed');

      // Re-throw domain exceptions as they contain proper HTTP status codes
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      // Convert any other errors to UnauthorizedError
      throw new UnauthorizedError('Authentication failed');
    }
  }

  /**
   * Extracts the Bearer token from the Authorization header
   * @param request - HTTP request object
   * @returns string | undefined - The extracted token or undefined if not found
   */
  private extractTokenFromHeader(request: AuthenticatedRequest): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}

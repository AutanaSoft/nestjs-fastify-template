import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * GraphQL JWT Authentication Guard
 *
 * This guard extends the JWT AuthGuard to work specifically with GraphQL contexts.
 * It adapts the request context from GraphQL execution context to work with Passport strategies.
 *
 * Unlike the standard JwtAuthGuard which works with HTTP requests,
 * this guard extracts the request from the GraphQL context properly.
 *
 * @example
 * ```typescript
 * @UseGuards(GqlJwtAuthGuard)
 * @Query(() => UserDto)
 * async getCurrentUser(@CurrentUser() user: UserEntity) {
 *   return user;
 * }
 * ```
 */
@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Extracts the request object from GraphQL execution context
   *
   * This method overrides the default behavior to work with GraphQL contexts.
   * It extracts the HTTP request from the GraphQL context so that Passport
   * can access headers, authentication tokens, etc.
   *
   * @param context - The execution context (GraphQL in this case)
   * @returns The HTTP request object
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return ctx.getContext().req;
  }
}

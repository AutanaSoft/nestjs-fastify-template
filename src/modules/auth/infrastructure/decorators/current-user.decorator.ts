import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserEntity } from '@/modules/user/domain/entities';

/**
 * Current User Parameter Decorator
 *
 * This decorator extracts the authenticated user from the request context.
 * It works with both HTTP requests and GraphQL contexts, automatically
 * detecting the context type and extracting the user appropriately.
 *
 * The user is available after successful JWT authentication via JwtAuthGuard.
 *
 * @example HTTP Controller
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile(@CurrentUser() user: UserEntity) {
 *   return user;
 * }
 * ```
 *
 * @example GraphQL Resolver
 * ```typescript
 * @UseGuards(GqlJwtAuthGuard)
 * @Query(() => UserDto)
 * getCurrentUser(@CurrentUser() user: UserEntity) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserEntity => {
    // Check if we're in a GraphQL context
    const contextType = context.getType<'http' | 'graphql'>();
    if (contextType === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return gqlContext.getContext().req.user as UserEntity;
    }

    // HTTP context
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return request.user as UserEntity;
  },
);

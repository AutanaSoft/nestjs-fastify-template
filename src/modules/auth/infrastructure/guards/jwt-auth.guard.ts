import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 *
 * This guard extends the Passport AuthGuard to provide JWT-based authentication.
 * It automatically validates JWT tokens and populates the request with user information.
 *
 * Usage:
 * - Apply to controllers or routes that require authentication
 * - Can be used globally or on specific endpoints
 * - Works with both REST and GraphQL endpoints (when properly configured)
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @Query(() => User)
 * async getCurrentUser(@CurrentUser() user: UserEntity) {
 *   return user;
 * }
 * ```
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

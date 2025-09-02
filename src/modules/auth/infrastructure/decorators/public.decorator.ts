import { SetMetadata } from '@nestjs/common';

import { IS_PUBLIC_KEY } from '../guards/auth.guard';

/**
 * Decorator to mark routes as public (skipping authentication)
 * Usage: @Public() before route handler methods
 *
 * @example
 * ```typescript
 * @Public()
 * @Post('login')
 * async signIn(@Body() signInDto: SignInDto) {
 *   return this.authService.signIn(signInDto);
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

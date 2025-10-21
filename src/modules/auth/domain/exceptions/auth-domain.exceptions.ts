import { UnauthorizedError, ConflictError, ForbiddenError } from '@/shared/domain/errors';
import { AuthErrorCode } from '../enums';

/**
 * Exception thrown when user provides invalid credentials during sign-in
 */
export class InvalidCredentialsDomainException extends UnauthorizedError {
  readonly code = AuthErrorCode.INVALID_CREDENTIALS;

  constructor() {
    super('Invalid credentials provided', {
      extensions: {
        code: AuthErrorCode.INVALID_CREDENTIALS,
        statusCode: 401,
      },
    });
  }
}

/**
 * Exception thrown when trying to register with an email that already exists
 */
export class EmailAlreadyExistsDomainException extends ConflictError {
  readonly code = AuthErrorCode.EMAIL_ALREADY_EXISTS;

  constructor(email: string) {
    super(`Email '${email}' is already registered`, {
      extensions: {
        code: AuthErrorCode.EMAIL_ALREADY_EXISTS,
        statusCode: 409,
      },
    });
  }
}

/**
 * Exception thrown when trying to register with a username that already exists
 */
export class UsernameAlreadyExistsDomainException extends ConflictError {
  readonly code = AuthErrorCode.USERNAME_ALREADY_EXISTS;

  constructor(userName: string) {
    super(`Username '${userName}' is already taken`, {
      extensions: {
        code: AuthErrorCode.USERNAME_ALREADY_EXISTS,
        statusCode: 409,
      },
    });
  }
}

/**
 * Exception thrown when user account is inactive
 */
export class AccountInactiveDomainException extends ForbiddenError {
  readonly code = AuthErrorCode.ACCOUNT_INACTIVE;

  constructor() {
    super('Account is inactive', {
      extensions: {
        code: AuthErrorCode.ACCOUNT_INACTIVE,
        statusCode: 403,
      },
    });
  }
}

/**
 * Exception thrown when user account is banned
 */
export class AccountBannedDomainException extends ForbiddenError {
  readonly code = AuthErrorCode.ACCOUNT_BANNED;

  constructor() {
    super('Account has been banned', {
      extensions: {
        code: AuthErrorCode.ACCOUNT_BANNED,
        statusCode: 403,
      },
    });
  }
}

/**
 * Exception thrown when refresh token is invalid or expired
 */
export class InvalidRefreshTokenDomainException extends UnauthorizedError {
  readonly code = AuthErrorCode.INVALID_REFRESH_TOKEN;

  constructor() {
    super('Invalid or expired refresh token', {
      extensions: {
        code: AuthErrorCode.INVALID_REFRESH_TOKEN,
        statusCode: 401,
      },
    });
  }
}

/**
 * Exception thrown when JWT token has expired
 */
export class TokenExpiredDomainException extends UnauthorizedError {
  readonly code = AuthErrorCode.TOKEN_EXPIRED;

  constructor() {
    super('Token has expired', {
      extensions: {
        code: AuthErrorCode.TOKEN_EXPIRED,
        statusCode: 401,
      },
    });
  }
}

/**
 * Exception thrown when JWT token is invalid
 */
export class InvalidTokenDomainException extends UnauthorizedError {
  readonly code = AuthErrorCode.INVALID_TOKEN;

  constructor() {
    super('Invalid token provided', {
      extensions: {
        code: AuthErrorCode.INVALID_TOKEN,
        statusCode: 401,
      },
    });
  }
}

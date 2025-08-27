# Domain Errors Usage Guide

## New GraphQL-Compatible Constructor Format

All domain errors now use exactly the same interface as `GraphQLError` for perfect consistency:

```typescript
new ErrorClass(message, options);
```

Where `options` follows the `GraphQLError` pattern:

```typescript
interface DomainErrorOptions {
  originalError?: Maybe<Error>;
  extensions?: {
    [attributeName: string]: unknown;
    code?: string;
    statusCode?: number;
  };
}
```

## Usage Examples

### Basic Usage

````typescript
import { NotFoundError, ConflictError, BadRequestError } from '@shared/domain/errors';

## Usage Examples

### Basic Usage

```typescript
import { NotFoundError, ConflictError, BadRequestError } from '@shared/domain/errors';

// Simple error with default code and statusCode
throw new NotFoundError('User not found');
// Extensions: { code: 'NOT_FOUND', statusCode: 404 }

// Error with custom extensions (keeps default code and statusCode)
throw new ConflictError('User already exists', {
  extensions: {
    email: 'user@example.com',
    userId: 123
  }
});
// Extensions: { code: 'CONFLICT', statusCode: 409, email: 'user@example.com', userId: 123 }

// Error with original error and custom extensions
throw new BadRequestError('Invalid email format', {
  originalError: validationError,
  extensions: {
    field: 'email',
    value: 'invalid-email'
  }
});
// Extensions: { code: 'BAD_REQUEST', statusCode: 400, field: 'email', value: 'invalid-email' }
````

### Overriding Default Codes and Status Codes

```typescript
import { NotFoundError, ConflictError, ValidationError } from '@shared/domain/errors';

// Override default code for more specific error identification
throw new NotFoundError('User not found', {
  extensions: {
    code: 'USER_NOT_FOUND', // Overrides default 'NOT_FOUND'
    userId: 12345,
  },
});
// Extensions: { code: 'USER_NOT_FOUND', statusCode: 404, userId: 12345 }

// Override default code for profile-specific error
throw new NotFoundError('Profile not found', {
  extensions: {
    code: 'PROFILE_NOT_FOUND', // Overrides default 'NOT_FOUND'
    profileId: 'abc123',
  },
});
// Extensions: { code: 'PROFILE_NOT_FOUND', statusCode: 404, profileId: 'abc123' }

// Override default code for conflict scenarios
throw new ConflictError('Email already in use', {
  extensions: {
    code: 'USER_CREATE_CONFLICT', // Overrides default 'CONFLICT'
    email: 'user@example.com',
  },
});
// Extensions: { code: 'USER_CREATE_CONFLICT', statusCode: 409, email: 'user@example.com' }

// Override default code for update conflicts
throw new ConflictError('Profile update conflict', {
  extensions: {
    code: 'USER_UPDATE_CONFLICT', // Overrides default 'CONFLICT'
    userId: 12345,
    field: 'username',
  },
});
// Extensions: { code: 'USER_UPDATE_CONFLICT', statusCode: 409, userId: 12345, field: 'username' }

// Override both code and statusCode if needed
throw new ValidationError('Custom validation failed', ['Field is required'], {
  extensions: {
    code: 'CUSTOM_VALIDATION_ERROR', // Overrides default 'VALIDATION_ERROR'
    statusCode: 422, // Overrides default 400
    customField: 'value',
  },
});
// Extensions: { code: 'CUSTOM_VALIDATION_ERROR', statusCode: 422, errors: [...], customField: 'value' }
```

### Real-World Domain-Specific Examples

```typescript
// User Management Domain
throw new NotFoundError('User account not found', {
  extensions: {
    code: 'USER_ACCOUNT_NOT_FOUND',
    userId: 12345,
    source: 'user_service',
  },
});

throw new ConflictError('Username already taken', {
  extensions: {
    code: 'USERNAME_CONFLICT',
    username: 'john_doe',
    suggestedAlternatives: ['john_doe1', 'john_doe2'],
  },
});

// Product Management Domain
throw new NotFoundError('Product not in inventory', {
  extensions: {
    code: 'PRODUCT_NOT_IN_INVENTORY',
    productId: 'SKU-12345',
    warehouse: 'WH-001',
  },
});

throw new ConflictError('Product already exists in catalog', {
  extensions: {
    code: 'PRODUCT_CATALOG_CONFLICT',
    sku: 'SKU-12345',
    existingProductId: 67890,
  },
});

// Order Management Domain
throw new UnprocessableEntityError('Order cannot be cancelled', {
  extensions: {
    code: 'ORDER_CANCELLATION_NOT_ALLOWED',
    orderId: 'ORD-12345',
    currentStatus: 'shipped',
    reason: 'Order already in transit',
  },
});

// Payment Domain
throw new BadRequestError('Invalid payment method', {
  extensions: {
    code: 'PAYMENT_METHOD_INVALID',
    paymentMethodId: 'pm_12345',
    supportedMethods: ['credit_card', 'paypal'],
  },
});
```

````

### Validation Errors (Special Case)

```typescript
import { ValidationError } from '@shared/domain/errors';

// ValidationError has an additional errors array parameter
throw new ValidationError(
  'Validation failed',
  ['Email is required', 'Password must be at least 8 characters'],
  {
    extensions: {
      userId: 123,
      operation: 'user_registration',
    },
    originalError: validationLibraryError,
  },
);
````

### Complete Examples by Category

#### Authentication & Authorization

```typescript
// Authentication failure
throw new UnauthorizedError('Invalid credentials', {
  extensions: {
    loginAttempt: 1,
    ip: '192.168.1.1',
  },
});

// Access denied
throw new ForbiddenError('Insufficient permissions', {
  extensions: {
    requiredRole: 'admin',
    userRole: 'user',
    resource: 'admin_panel',
  },
});
```

#### Client Errors (4xx)

```typescript
// Bad request
throw new BadRequestError('Missing required fields', {
  extensions: {
    missingFields: ['name', 'email'],
  },
});

// Resource not found
throw new NotFoundError('Product not found', {
  extensions: {
    productId: 12345,
    category: 'electronics',
  },
});

// Method not allowed
throw new MethodNotAllowedError('DELETE not allowed on this resource', {
  extensions: {
    allowedMethods: ['GET', 'POST'],
    resource: '/api/users',
  },
});

// Payload too large
throw new PayloadTooLargeError('File size exceeds limit', {
  extensions: {
    maxSize: '10MB',
    actualSize: '15MB',
    fileType: 'image/jpeg',
  },
});
```

#### Server Errors (5xx)

```typescript
// Internal server error
throw new InternalServerError('Database connection failed', {
  originalError: dbConnectionError,
  extensions: {
    operation: 'user_creation',
    database: 'postgresql',
    timestamp: new Date().toISOString(),
  },
});

// Not implemented
throw new NotImplementedError('Feature coming soon', {
  extensions: {
    feature: 'advanced_analytics',
    estimatedRelease: '2025-Q4',
  },
});

// Service unavailable
throw new ServiceUnavailableError('Payment service temporarily unavailable', {
  extensions: {
    service: 'stripe',
    retryAfter: 300,
    maintenanceWindow: '2025-08-27T14:00:00Z',
  },
});
```

#### Gateway Errors

```typescript
// Bad gateway
throw new BadGatewayError('Invalid response from upstream service', {
  originalError: upstreamError,
  extensions: {
    service: 'user-service',
    url: 'http://user-service/api/users',
    responseStatus: 502,
  },
});

// Gateway timeout
throw new GatewayTimeoutError('Upstream service timeout', {
  extensions: {
    service: 'payment-service',
    timeout: 30000,
    endpoint: '/api/v1/payments',
  },
});
```

## Migration from Old Format

### Before (Custom Format)

```typescript
throw new NotFoundError('User not found', originalError, { userId: 123 });
```

### After (GraphQL Format)

```typescript
throw new NotFoundError('User not found', {
  originalError,
  extensions: {
    userId: 123,
  },
});
```

## Benefits of New Format

1. **100% GraphQL Compatibility**: Uses exactly the same interface as `GraphQLError`
2. **Native GraphQL Integration**: Perfect integration with GraphQL ecosystem
3. **Automatic Code/Status**: Each error automatically includes proper code and statusCode
4. **Override Capability**: Default codes and statusCodes can be overridden when needed
5. **Flexible Extensions**: Any additional data can be added to extensions
6. **Original Error Support**: Proper error chaining with `originalError`
7. **Type Safety**: Full TypeScript support and intellisense

## Best Practices for Custom Codes

### Naming Conventions

- Use `UPPER_SNAKE_CASE` for consistency
- Be specific and descriptive
- Include domain context when helpful
- Follow patterns: `{DOMAIN}_{ACTION}_{ERROR_TYPE}`

```typescript
// Good examples
'USER_NOT_FOUND';
'PROFILE_UPDATE_CONFLICT';
'ORDER_CANCELLATION_NOT_ALLOWED';
'PAYMENT_METHOD_INVALID';

// Avoid generic or unclear names
'ERROR';
'INVALID';
'FAILED';
```

### When to Override Default Codes

1. **Domain-Specific Errors**: When you need to distinguish between different types of the same error
2. **Client-Side Handling**: When frontend needs specific error codes for different UI behaviors
3. **API Documentation**: When API documentation requires specific error codes
4. **Monitoring/Alerting**: When you need specific error tracking in monitoring systems

### Maintaining StatusCode Consistency

- Generally keep the same statusCode as the base error type
- Only override statusCode when business logic specifically requires it
- Document any statusCode overrides clearly

```typescript
// Recommended: Keep same statusCode, change only code
throw new NotFoundError('User profile not found', {
  extensions: {
    code: 'USER_PROFILE_NOT_FOUND', // Custom code
    // statusCode: 404 (inherited, no override needed)
    userId: 12345,
  },
});

// Use with caution: Override statusCode only when necessary
throw new ValidationError('Business rule validation', ['Rule violated'], {
  extensions: {
    code: 'BUSINESS_RULE_VALIDATION',
    statusCode: 422, // Override from 400 to 422 for business rules
    rule: 'max_orders_per_day',
  },
});
```

## Integration with GraphQL Exception Filter

All errors work seamlessly with the existing `GraphQLExceptionFilter`:

```typescript
// In your resolver or service
throw new NotFoundError('Post not found', {
  extensions: {
    postId: 'abc123',
    userId: 'user456',
  },
});

// The filter will automatically:
// 1. Recognize it as a DomainError (extends GraphQLError)
// 2. Extract the GraphQL operation context
// 3. Log the error with full context
// 4. Return the GraphQLError directly to the client
```

## Error Extensions in GraphQL Response

Client will receive:

```json
{
  "errors": [
    {
      "message": "Post not found",
      "extensions": {
        "code": "NOT_FOUND",
        "statusCode": 404,
        "postId": "abc123",
        "userId": "user456"
      },
      "locations": [...],
      "path": [...]
    }
  ]
}
```

## Error Context in Logs

With structured logging:

```json
{
  "level": "error",
  "time": "2025-08-27T10:30:00.000Z",
  "msg": "Post not found",
  "error": {
    "extensions": {
      "code": "NOT_FOUND",
      "statusCode": 404,
      "postId": "abc123",
      "userId": "user456"
    }
  },
  "operation": {
    "fieldName": "getPost",
    "operation": "query",
    "userId": "user456",
    "correlationId": "req-12345"
  }
}
```

# Domain Errors - Practical Examples

## Override Examples by Use Case

### User Management Module

```typescript
import {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from '@shared/domain/errors';

// User not found scenarios
export class UserService {
  async findUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found', {
        extensions: {
          code: 'USER_NOT_FOUND',
          userId: id,
          searchedBy: 'id',
        },
      });
    }
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found', {
        extensions: {
          code: 'USER_NOT_FOUND_BY_EMAIL',
          email,
          searchedBy: 'email',
        },
      });
    }
    return user;
  }

  async createUser(userData: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User already exists', {
        extensions: {
          code: 'USER_CREATION_CONFLICT',
          email: userData.email,
          conflictField: 'email',
        },
      });
    }

    const existingUsername = await this.userRepository.findByUsername(userData.username);
    if (existingUsername) {
      throw new ConflictError('Username already taken', {
        extensions: {
          code: 'USERNAME_CONFLICT',
          username: userData.username,
          conflictField: 'username',
        },
      });
    }

    return this.userRepository.create(userData);
  }

  async updateUser(id: string, updateData: UpdateUserDto, currentUserId: string) {
    // Check if user exists
    const user = await this.findUserById(id);

    // Check authorization
    if (user.id !== currentUserId && !this.isAdmin(currentUserId)) {
      throw new ForbiddenError('Cannot update other user profile', {
        extensions: {
          code: 'USER_UPDATE_FORBIDDEN',
          targetUserId: id,
          requesterId: currentUserId,
          action: 'update_profile',
        },
      });
    }

    // Check for email conflicts if updating email
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateData.email);
      if (existingUser) {
        throw new ConflictError('Email already in use', {
          extensions: {
            code: 'USER_UPDATE_CONFLICT',
            email: updateData.email,
            conflictField: 'email',
            operation: 'update',
          },
        });
      }
    }

    return this.userRepository.update(id, updateData);
  }
}
```

### Product Management Module

```typescript
import { NotFoundError, ConflictError, UnprocessableEntityError } from '@shared/domain/errors';

export class ProductService {
  async findProduct(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found', {
        extensions: {
          code: 'PRODUCT_NOT_FOUND',
          productId: id,
          catalog: 'main',
        },
      });
    }
    return product;
  }

  async findProductInWarehouse(productId: string, warehouseId: string) {
    const product = await this.productRepository.findInWarehouse(productId, warehouseId);
    if (!product) {
      throw new NotFoundError('Product not available in warehouse', {
        extensions: {
          code: 'PRODUCT_NOT_IN_WAREHOUSE',
          productId,
          warehouseId,
          availableWarehouses: await this.getAvailableWarehouses(productId),
        },
      });
    }
    return product;
  }

  async createProduct(productData: CreateProductDto) {
    // Check SKU conflict
    const existingSku = await this.productRepository.findBySku(productData.sku);
    if (existingSku) {
      throw new ConflictError('Product SKU already exists', {
        extensions: {
          code: 'PRODUCT_SKU_CONFLICT',
          sku: productData.sku,
          existingProductId: existingSku.id,
          conflictField: 'sku',
        },
      });
    }

    // Check name conflict in same category
    const existingName = await this.productRepository.findByNameInCategory(
      productData.name,
      productData.categoryId,
    );
    if (existingName) {
      throw new ConflictError('Product name already exists in category', {
        extensions: {
          code: 'PRODUCT_NAME_CATEGORY_CONFLICT',
          name: productData.name,
          categoryId: productData.categoryId,
          existingProductId: existingName.id,
        },
      });
    }

    return this.productRepository.create(productData);
  }

  async deleteProduct(id: string) {
    const product = await this.findProduct(id);

    // Check if product has active orders
    const activeOrders = await this.orderService.findActiveOrdersWithProduct(id);
    if (activeOrders.length > 0) {
      throw new UnprocessableEntityError('Cannot delete product with active orders', {
        extensions: {
          code: 'PRODUCT_DELETE_HAS_ORDERS',
          productId: id,
          activeOrdersCount: activeOrders.length,
          activeOrderIds: activeOrders.map(o => o.id),
        },
      });
    }

    // Check if product has inventory
    const inventory = await this.inventoryService.getProductInventory(id);
    if (inventory.totalQuantity > 0) {
      throw new UnprocessableEntityError('Cannot delete product with remaining inventory', {
        extensions: {
          code: 'PRODUCT_DELETE_HAS_INVENTORY',
          productId: id,
          remainingQuantity: inventory.totalQuantity,
          warehouses: inventory.warehouses,
        },
      });
    }

    return this.productRepository.delete(id);
  }
}
```

### Order Management Module

```typescript
import {
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  BadRequestError,
} from '@shared/domain/errors';

export class OrderService {
  async findOrder(id: string, userId?: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found', {
        extensions: {
          code: 'ORDER_NOT_FOUND',
          orderId: id,
          searchContext: userId ? 'user_orders' : 'all_orders',
        },
      });
    }

    if (userId && order.userId !== userId) {
      throw new NotFoundError('Order not found', {
        extensions: {
          code: 'USER_ORDER_NOT_FOUND',
          orderId: id,
          userId,
          reason: 'Order does not belong to user',
        },
      });
    }

    return order;
  }

  async cancelOrder(id: string, reason?: string) {
    const order = await this.findOrder(id);

    // Check if order can be cancelled based on status
    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.status)) {
      throw new UnprocessableEntityError('Order cannot be cancelled', {
        extensions: {
          code: 'ORDER_CANCELLATION_NOT_ALLOWED',
          orderId: id,
          currentStatus: order.status,
          allowedStatuses: cancellableStatuses,
          reason: `Order is already ${order.status}`,
        },
      });
    }

    // Check if order has been shipped
    if (order.shippedAt) {
      throw new UnprocessableEntityError('Cannot cancel shipped order', {
        extensions: {
          code: 'ORDER_ALREADY_SHIPPED',
          orderId: id,
          shippedAt: order.shippedAt,
          trackingNumber: order.trackingNumber,
        },
      });
    }

    return this.orderRepository.cancel(id, reason);
  }

  async updateOrderStatus(id: string, newStatus: OrderStatus, metadata?: Record<string, unknown>) {
    const order = await this.findOrder(id);

    // Validate status transition
    const validTransitions = this.getValidStatusTransitions(order.status);
    if (!validTransitions.includes(newStatus)) {
      throw new BadRequestError('Invalid order status transition', {
        extensions: {
          code: 'INVALID_ORDER_STATUS_TRANSITION',
          orderId: id,
          currentStatus: order.status,
          requestedStatus: newStatus,
          validTransitions,
        },
      });
    }

    return this.orderRepository.updateStatus(id, newStatus, metadata);
  }

  async refundOrder(id: string, amount?: number) {
    const order = await this.findOrder(id);

    // Check if order is refundable
    if (!['completed', 'cancelled'].includes(order.status)) {
      throw new UnprocessableEntityError('Order not eligible for refund', {
        extensions: {
          code: 'ORDER_NOT_REFUNDABLE',
          orderId: id,
          currentStatus: order.status,
          eligibleStatuses: ['completed', 'cancelled'],
        },
      });
    }

    // Check if already fully refunded
    if (order.refundedAmount >= order.totalAmount) {
      throw new ConflictError('Order already fully refunded', {
        extensions: {
          code: 'ORDER_ALREADY_REFUNDED',
          orderId: id,
          totalAmount: order.totalAmount,
          refundedAmount: order.refundedAmount,
        },
      });
    }

    // Validate refund amount
    const maxRefundable = order.totalAmount - order.refundedAmount;
    const refundAmount = amount || maxRefundable;

    if (refundAmount > maxRefundable) {
      throw new BadRequestError('Refund amount exceeds maximum refundable', {
        extensions: {
          code: 'REFUND_AMOUNT_EXCEEDS_MAXIMUM',
          orderId: id,
          requestedAmount: refundAmount,
          maxRefundable,
          totalAmount: order.totalAmount,
          alreadyRefunded: order.refundedAmount,
        },
      });
    }

    return this.paymentService.processRefund(order.paymentId, refundAmount);
  }
}
```

### Authentication & Authorization Module

```typescript
import {
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
  NotFoundError,
} from '@shared/domain/errors';

export class AuthService {
  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials', {
        extensions: {
          code: 'LOGIN_INVALID_CREDENTIALS',
          email,
          reason: 'user_not_found',
        },
      });
    }

    const isPasswordValid = await this.passwordService.verify(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials', {
        extensions: {
          code: 'LOGIN_INVALID_CREDENTIALS',
          email,
          reason: 'invalid_password',
        },
      });
    }

    if (!user.emailVerified) {
      throw new UnauthorizedError('Email not verified', {
        extensions: {
          code: 'LOGIN_EMAIL_NOT_VERIFIED',
          email,
          userId: user.id,
        },
      });
    }

    if (user.status === 'suspended') {
      throw new ForbiddenError('Account suspended', {
        extensions: {
          code: 'LOGIN_ACCOUNT_SUSPENDED',
          userId: user.id,
          suspensionReason: user.suspensionReason,
          suspendedUntil: user.suspendedUntil,
        },
      });
    }

    return this.tokenService.generateTokens(user);
  }

  async resetPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists for security
      throw new NotFoundError('User not found', {
        extensions: {
          code: 'PASSWORD_RESET_USER_NOT_FOUND',
          email,
        },
      });
    }

    const recentReset = await this.passwordResetRepository.findRecentReset(user.id);
    if (recentReset && !this.isResetExpired(recentReset)) {
      throw new BadRequestError('Password reset already requested', {
        extensions: {
          code: 'PASSWORD_RESET_ALREADY_REQUESTED',
          userId: user.id,
          requestedAt: recentReset.createdAt,
          canRequestAgainAt: this.getNextAllowedResetTime(recentReset),
        },
      });
    }

    return this.passwordResetService.initiateReset(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userService.findById(userId);

    const isCurrentPasswordValid = await this.passwordService.verify(
      currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect', {
        extensions: {
          code: 'PASSWORD_CHANGE_INVALID_CURRENT',
          userId,
        },
      });
    }

    if (currentPassword === newPassword) {
      throw new BadRequestError('New password must be different from current password', {
        extensions: {
          code: 'PASSWORD_CHANGE_SAME_AS_CURRENT',
          userId,
        },
      });
    }

    return this.passwordService.updatePassword(userId, newPassword);
  }
}
```

## Error Code Patterns

### Recommended Patterns

```typescript
// Pattern: {ENTITY}_{ACTION}_{ERROR_TYPE}
'USER_CREATE_CONFLICT';
'PRODUCT_DELETE_NOT_ALLOWED';
'ORDER_CANCELLATION_FORBIDDEN';

// Pattern: {ENTITY}_{SPECIFIC_ERROR}
'USER_NOT_FOUND';
'PRODUCT_OUT_OF_STOCK';
'ORDER_ALREADY_SHIPPED';

// Pattern: {ACTION}_{ERROR_TYPE}_{CONTEXT}
'LOGIN_INVALID_CREDENTIALS';
'PAYMENT_PROCESSING_FAILED';
'UPLOAD_FILE_TOO_LARGE';
```

### Error Code Registry

Keep a centralized registry for consistency:

```typescript
// errors/codes.ts
export const ErrorCodes = {
  // User Management
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_NOT_FOUND_BY_EMAIL: 'USER_NOT_FOUND_BY_EMAIL',
  USER_CREATION_CONFLICT: 'USER_CREATION_CONFLICT',
  USERNAME_CONFLICT: 'USERNAME_CONFLICT',
  USER_UPDATE_CONFLICT: 'USER_UPDATE_CONFLICT',
  USER_UPDATE_FORBIDDEN: 'USER_UPDATE_FORBIDDEN',

  // Product Management
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  PRODUCT_NOT_IN_WAREHOUSE: 'PRODUCT_NOT_IN_WAREHOUSE',
  PRODUCT_SKU_CONFLICT: 'PRODUCT_SKU_CONFLICT',
  PRODUCT_DELETE_HAS_ORDERS: 'PRODUCT_DELETE_HAS_ORDERS',

  // Order Management
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  USER_ORDER_NOT_FOUND: 'USER_ORDER_NOT_FOUND',
  ORDER_CANCELLATION_NOT_ALLOWED: 'ORDER_CANCELLATION_NOT_ALLOWED',
  ORDER_ALREADY_SHIPPED: 'ORDER_ALREADY_SHIPPED',

  // Authentication
  LOGIN_INVALID_CREDENTIALS: 'LOGIN_INVALID_CREDENTIALS',
  LOGIN_EMAIL_NOT_VERIFIED: 'LOGIN_EMAIL_NOT_VERIFIED',
  LOGIN_ACCOUNT_SUSPENDED: 'LOGIN_ACCOUNT_SUSPENDED',

  // Infrastructure - Database
  DATABASE_UNIQUE_CONSTRAINT: 'DATABASE_UNIQUE_CONSTRAINT',
  USER_CREATION_DATABASE_ERROR: 'USER_CREATION_DATABASE_ERROR',
  USER_RETRIEVAL_DATABASE_ERROR: 'USER_RETRIEVAL_DATABASE_ERROR',

  // Infrastructure - External Services
  PAYMENT_SERVICE_UNAVAILABLE: 'PAYMENT_SERVICE_UNAVAILABLE',
  PAYMENT_PROCESSING_ERROR: 'PAYMENT_PROCESSING_ERROR',
  PAYMENT_RATE_LIMIT_EXCEEDED: 'PAYMENT_RATE_LIMIT_EXCEEDED',
  EMAIL_RATE_LIMIT_EXCEEDED: 'EMAIL_RATE_LIMIT_EXCEEDED',
  EMAIL_AUTHENTICATION_FAILED: 'EMAIL_AUTHENTICATION_FAILED',
  EMAIL_SEND_ERROR: 'EMAIL_SEND_ERROR',

  // Infrastructure - Network
  PAYMENT_SERVICE_CONNECTION_REFUSED: 'PAYMENT_SERVICE_CONNECTION_REFUSED',

  // Infrastructure - Cache
  CACHE_CONNECTION_REFUSED: 'CACHE_CONNECTION_REFUSED',
  CACHE_GET_ERROR: 'CACHE_GET_ERROR',
  CACHE_SET_ERROR: 'CACHE_SET_ERROR',
  CACHE_OUT_OF_MEMORY: 'CACHE_OUT_OF_MEMORY',
  CACHE_INVALIDATION_ERROR: 'CACHE_INVALIDATION_ERROR',
} as const;
```

Usage with registry:

```typescript
import { ErrorCodes } from './errors/codes';

throw new NotFoundError('User not found', {
  extensions: {
    code: ErrorCodes.USER_NOT_FOUND,
    userId: id,
  },
});
```

### Infrastructure Layer Module

```typescript
import {
  DatabaseError,
  ExternalServiceError,
  NetworkError,
  CacheError,
} from '@shared/domain/errors';

export class UserRepository {
  async create(userData: CreateUserDto) {
    try {
      return await this.prisma.user.create({ data: userData });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new DatabaseError('Unique constraint violation', {
          extensions: {
            code: 'DATABASE_UNIQUE_CONSTRAINT',
            table: 'users',
            constraint: error.meta?.target,
            originalError: error,
          },
        });
      }

      throw new DatabaseError('Failed to create user', {
        extensions: {
          code: 'USER_CREATION_DATABASE_ERROR',
          operation: 'create',
          table: 'users',
          originalError: error,
        },
      });
    }
  }

  async findById(id: string) {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch (error) {
      throw new DatabaseError('Failed to retrieve user', {
        extensions: {
          code: 'USER_RETRIEVAL_DATABASE_ERROR',
          operation: 'findUnique',
          table: 'users',
          userId: id,
          originalError: error,
        },
      });
    }
  }
}

export class PaymentService {
  async processPayment(paymentData: PaymentDto) {
    try {
      const response = await this.httpClient.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 503) {
        throw new ExternalServiceError('Payment service temporarily unavailable', {
          extensions: {
            code: 'PAYMENT_SERVICE_UNAVAILABLE',
            service: 'stripe',
            statusCode: 503,
            retryAfter: error.response.headers['retry-after'],
          },
        });
      }

      if (error.code === 'ECONNREFUSED') {
        throw new NetworkError('Unable to connect to payment service', {
          extensions: {
            code: 'PAYMENT_SERVICE_CONNECTION_REFUSED',
            service: 'stripe',
            host: this.config.paymentServiceUrl,
            originalError: error,
          },
        });
      }

      throw new ExternalServiceError('Payment processing failed', {
        extensions: {
          code: 'PAYMENT_PROCESSING_ERROR',
          service: 'stripe',
          statusCode: error.response?.status || 500,
          originalError: error,
        },
      });
    }
  }

  async refundPayment(paymentId: string, amount: number) {
    try {
      const response = await this.httpClient.post(`/payments/${paymentId}/refund`, { amount });
      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        throw new ExternalServiceError('Rate limit exceeded', {
          extensions: {
            code: 'PAYMENT_RATE_LIMIT_EXCEEDED',
            service: 'stripe',
            statusCode: 429,
            retryAfter: error.response.headers['retry-after'],
          },
        });
      }

      throw new ExternalServiceError('Refund processing failed', {
        extensions: {
          code: 'REFUND_PROCESSING_ERROR',
          service: 'stripe',
          paymentId,
          amount,
          originalError: error,
        },
      });
    }
  }
}

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new CacheError('Redis connection refused', {
          extensions: {
            code: 'CACHE_CONNECTION_REFUSED',
            operation: 'get',
            key,
            host: this.config.redis.host,
            port: this.config.redis.port,
          },
        });
      }

      throw new CacheError('Failed to retrieve value from cache', {
        extensions: {
          code: 'CACHE_GET_ERROR',
          operation: 'get',
          key,
          originalError: error,
        },
      });
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      if (error.message.includes('OOM')) {
        throw new CacheError('Redis out of memory', {
          extensions: {
            code: 'CACHE_OUT_OF_MEMORY',
            operation: 'set',
            key,
            valueSize: Buffer.byteLength(JSON.stringify(value)),
          },
        });
      }

      throw new CacheError('Failed to store value in cache', {
        extensions: {
          code: 'CACHE_SET_ERROR',
          operation: 'set',
          key,
          ttl,
          originalError: error,
        },
      });
    }
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      throw new CacheError('Failed to invalidate cache keys', {
        extensions: {
          code: 'CACHE_INVALIDATION_ERROR',
          operation: 'invalidate',
          pattern,
          originalError: error,
        },
      });
    }
  }
}

export class EmailService {
  async sendEmail(to: string, subject: string, body: string) {
    try {
      const response = await this.emailProvider.send({
        to,
        subject,
        html: body,
      });
      return response;
    } catch (error) {
      if (error.response?.status === 429) {
        throw new ExternalServiceError('Email rate limit exceeded', {
          extensions: {
            code: 'EMAIL_RATE_LIMIT_EXCEEDED',
            service: 'sendgrid',
            statusCode: 429,
            recipient: to,
            retryAfter: error.response.headers['retry-after'],
          },
        });
      }

      if (error.response?.status === 401) {
        throw new ExternalServiceError('Email service authentication failed', {
          extensions: {
            code: 'EMAIL_AUTHENTICATION_FAILED',
            service: 'sendgrid',
            statusCode: 401,
          },
        });
      }

      throw new ExternalServiceError('Failed to send email', {
        extensions: {
          code: 'EMAIL_SEND_ERROR',
          service: 'sendgrid',
          recipient: to,
          subject,
          originalError: error,
        },
      });
    }
  }
}
```

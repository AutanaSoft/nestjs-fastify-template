---
applyTo: '**'
---

# TypeScript Best Practices for NestJS with Hexagonal Architecture

## 1. Type Safety with Strict Configuration

### Strict TypeScript Settings

- Use strict mode with comprehensive compiler options
- Enable all strict checks: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`
- Never use `any` type - use proper type annotations or `unknown` instead
- Use type assertions sparingly and with type guards
- Leverage TypeScript's built-in utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`

```typescript
// tsconfig.json recommended settings
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Domain Types and Interfaces

```typescript
// Domain entity with proper typing
export class UserEntity {
  id: string;
  email: string;
  password: string;
  userName: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Use branded types for IDs
export type UserId = string & { readonly brand: unique symbol };

// Domain data types with strict typing
export interface UserCreateData {
  readonly email: string;
  readonly password: string;
  readonly userName: string;
  readonly status?: UserStatus;
  readonly role?: UserRole;
}
```

## 2. Naming Conventions and Code Organization

### Consistent Naming Patterns

- **Classes**: PascalCase with descriptive suffixes (`UserEntity`, `UserRepository`, `CreateUserUseCase`)
- **Interfaces**: PascalCase without prefixes (`UserRepository` not `IUserRepository`)
- **Types**: PascalCase with `Type` suffix when needed (`UserCreateData`)
- **Enums**: PascalCase with descriptive names (`UserStatus`, `UserRole`)
- **Files**: kebab-case matching class names (`user.entity.ts`, `create-user.use-case.ts`)
- **Directories**: kebab-case following hexagonal structure (`domain/entities`, `application/use-cases`)

```typescript
// Proper enum definition with GraphQL registration
export enum UserStatus {
  REGISTERED = 'REGISTERED',
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  INACTIVE = 'INACTIVE',
}

registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'User account status indicating the current state of the user account',
});
```

### File and Module Organization

```typescript
// Barrel exports in index.ts files
export * from './user.entity';
export * from './user.types';
export * from './user.enums';

// Module organization following hexagonal architecture
@Module({
  imports: [SharedModule],
  providers: [
    {
      provide: UserRepository, // Abstract class token
      useClass: UserPrismaAdapter, // Concrete implementation
    },
    CreateUserUseCase,
    UpdateUserUseCase,
    FindUserByEmailUseCase,
    FindUsersUseCase,
    UserResolver,
  ],
})
export class UserModule {}
```

## 3. Repository Pattern and Dependency Injection

### Abstract Repository Interfaces

- Define repository contracts in domain layer using abstract classes
- Use dependency injection tokens for loose coupling
- Implement concrete adapters in infrastructure layer
- Never expose infrastructure concerns to application layer

```typescript
// Domain repository interface
export abstract class UserRepository {
  abstract create(data: UserCreateData): Promise<UserEntity>;
  abstract update(id: string, data: UserUpdateData): Promise<UserEntity>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findAll(query: UserFindAllData): Promise<UserEntity[]>;
}

// Infrastructure implementation
@Injectable()
export class UserPrismaAdapter extends UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaErrorHandler: PrismaErrorHandlerService,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(UserPrismaAdapter.name);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const logger = this.logger;
    logger.assign({ method: 'findById' });

    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      return user ? plainToInstance(UserEntity, user) : null;
    } catch (error) {
      this.prismaErrorHandler.handleError(
        error,
        {
          messages: {
            notFound: 'User not found',
            connection: 'Database unavailable',
            unknown: 'An unexpected error occurred while finding user',
          },
        },
        logger,
      );
    }
  }
}
```

### Use Case Implementation with Proper Types

```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectPinoLogger() private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CreateUserUseCase.name);
  }

  async execute(data: UserCreateArgsDto): Promise<UserDto> {
    const logger = this.logger;
    logger.assign({ method: 'execute' });

    try {
      // Use proper type transformation
      const hashedPassword = await HashUtils.hashPassword(data.data.password);
      const userData: UserCreateData = {
        ...data.data,
        password: hashedPassword,
      };

      const user = await this.userRepository.create(userData);

      // Transform to DTO with proper typing
      return plainToInstance(UserDto, user);
    } catch (error) {
      logger.error({ error, data }, 'Failed to create user');
      throw error;
    }
  }
}
```

## 4. Advanced TypeScript Patterns

### Generic Constraints and Utility Types

```typescript
// Generic constraints for repository operations
interface Repository<T, TCreateData, TUpdateData> {
  create(data: TCreateData): Promise<T>;
  update(id: string, data: TUpdateData): Promise<T>;
  findById(id: string): Promise<T | null>;
}

// Use utility types for data transformations
export type UserUpdateData = Partial<Omit<UserCreateData, 'email'>>;
export type UserPublicData = Omit<UserEntity, 'password'>;

// Branded types for type safety
export type EntityId = string & { readonly __brand: 'EntityId' };
export type Email = string & { readonly __brand: 'Email' };
```

### Type Guards and Discriminated Unions

```typescript
// Type guard for runtime type checking
export function isUserEntity(obj: unknown): obj is UserEntity {
  return (
    obj !== null && typeof obj === 'object' && 'id' in obj && 'email' in obj && 'userName' in obj
  );
}

// Discriminated unions for error handling
export type UserOperationResult =
  | { success: true; data: UserEntity }
  | { success: false; error: string; code: string };

// Usage with type narrowing
function handleUserResult(result: UserOperationResult): UserEntity {
  if (result.success) {
    return result.data; // TypeScript knows this is UserEntity
  }
  throw new Error(`User operation failed: ${result.error}`);
}
```

### Mapped Types and Conditional Types

```typescript
// Create readonly versions of entities
export type ReadonlyUser = Readonly<UserEntity>;

// Extract method names from a class
export type UserRepositoryMethods = keyof UserRepository;

// Conditional types for API responses
export type ApiResponse<T> = T extends UserEntity
  ? UserDto
  : T extends UserEntity[]
    ? UserDto[]
    : never;
```

## 5. Error Handling and Domain Exceptions

### Domain Exception Hierarchy

```typescript
// Base domain exception
export abstract class DomainException extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;
  }
}

// Specific domain exceptions
export class UserNotFoundDomainException extends DomainException {
  readonly code = 'USER_NOT_FOUND';
  readonly statusCode = 404;

  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
  }
}

export class UserAlreadyExistsDomainException extends DomainException {
  readonly code = 'USER_ALREADY_EXISTS';
  readonly statusCode = 409;

  constructor(field: string, value: string) {
    super(`User with ${field} '${value}' already exists`);
  }
}
```

### Async/Await with Proper Error Handling

```typescript
@Injectable()
export class UpdateUserUseCase {
  async execute(id: string, data: UserUpdateArgsDto): Promise<UserDto> {
    const logger = this.logger;
    logger.assign({ method: 'execute' });

    try {
      // Validate user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new UserNotFoundDomainException(id);
      }

      // Hash password if provided
      const updateData: UserUpdateData = { ...data.data };
      if (updateData.password) {
        updateData.password = await HashUtils.hashPassword(updateData.password);
      }

      // Update user
      const updatedUser = await this.userRepository.update(id, updateData);

      return plainToInstance(UserDto, updatedUser);
    } catch (error) {
      if (error instanceof DomainException) {
        logger.warn({ error: error.message, userId: id }, 'Domain validation failed');
        throw error;
      }

      logger.error({ error, userId: id, data }, 'Unexpected error updating user');
      throw new Error('Failed to update user');
    }
  }
}
```

## 6. Testing with TypeScript

### Unit Testing with Proper Mocking

```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let logger: jest.Mocked<PinoLogger>;

  beforeEach(async () => {
    // Create properly typed mocks
    const mockUserRepository: jest.Mocked<UserRepository> = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
    };

    const mockLogger = {
      setContext: jest.fn(),
      assign: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as jest.Mocked<PinoLogger>;

    const module = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get(UserRepository);
    logger = module.get(PinoLogger);
  });

  it('should create user with valid data', async () => {
    // Arrange
    const userData: UserCreateArgsDto = {
      data: {
        email: 'test@example.com',
        password: 'password123',
        userName: 'testuser',
        role: UserRole.USER,
      },
    };

    const expectedUser: UserEntity = {
      id: '123',
      email: userData.data.email,
      userName: userData.data.userName,
      password: 'hashedPassword',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userRepository.create.mockResolvedValue(expectedUser);

    // Act
    const result = await useCase.execute(userData);

    // Assert
    expect(result).toEqual(
      expect.objectContaining({
        email: userData.data.email,
        userName: userData.data.userName,
      }),
    );
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: userData.data.email,
        userName: userData.data.userName,
        password: expect.any(String), // Hashed password
      }),
    );
  });

  it('should handle user creation failure', async () => {
    // Arrange
    const userData: UserCreateArgsDto = {
      data: {
        email: 'test@example.com',
        password: 'password123',
        userName: 'testuser',
      },
    };

    userRepository.create.mockRejectedValue(
      new UserAlreadyExistsDomainException('email', userData.data.email),
    );

    // Act & Assert
    await expect(useCase.execute(userData)).rejects.toThrow(UserAlreadyExistsDomainException);
  });
});
```

### Integration Testing Types

```typescript
// Test data factories with proper typing
export class UserTestDataFactory {
  static createUserData(overrides: Partial<UserCreateData> = {}): UserCreateData {
    return {
      email: 'test@example.com',
      password: 'password123',
      userName: 'testuser',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      ...overrides,
    };
  }

  static createUserEntity(overrides: Partial<UserEntity> = {}): UserEntity {
    return {
      id: uuid(),
      email: 'test@example.com',
      userName: 'testuser',
      password: 'hashedPassword',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }
}
```

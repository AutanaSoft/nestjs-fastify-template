---
description: 'TypeScript coding guidelines for NestJS Fastify template with hexagonal architecture'
applyTo: '**/*.ts,**/*.tsx'
---

# TypeScript Guidelines - NestJS Fastify Template

## Core TypeScript Configuration

This project uses TypeScript 5.7+ with ES2023 target and CommonJS modules.

- Decorators: `experimentalDecorators: true` for NestJS decorators
- Strict Mode: Partial (`strictNullChecks: true`, but `noImplicitAny: false`)
- Path Mapping: `@/`, `@config/`, `@shared/`, `@modules/` for clean imports

## NestJS + Fastify Patterns

### Injectable Services and Providers

```typescript
@Injectable()
export class MyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async processData<T>(data: T): Promise<ProcessedData<T>> {
    // Implementation
  }
}
```

### Controllers with Fastify Types

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';

@Controller('api')
export class MyController {
  @Get('data')
  async getData(@Req() request: FastifyRequest, @Res() reply: FastifyReply): Promise<ResponseDto> {
    // Always return typed responses
  }
}
```

## Configuration Pattern (Typed Factory)

Always use typed configuration with registerAs:

```typescript
export type MyConfig = {
  readonly apiKey: string;
  readonly timeout: number;
  readonly enabled: boolean;
};

export default registerAs(
  'myConfig',
  (): MyConfig => ({
    apiKey: process.env.MY_API_KEY || '',
    timeout: parseInt(process.env.MY_TIMEOUT || '5000', 10),
    enabled: process.env.MY_ENABLED === 'true',
  }),
);
```

## DTO Validation (class-validator + class-transformer)

### Request DTOs

```typescript
export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'User age', minimum: 18, maximum: 100 })
  @IsInt()
  @Min(18)
  @Max(100)
  @Type(() => Number)
  readonly age: number;

  @ApiProperty({ description: 'Optional bio', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly bio?: string;
}
```

### Response DTOs

```typescript
export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: 'uuid-string' })
  readonly id: string;

  @ApiProperty({ description: 'User email' })
  readonly email: string;

  @Exclude() // Hide sensitive data
  readonly password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
```

## Hexagonal Architecture Types

### Domain Entities (Pure TypeScript)

```typescript
// No decorators, pure business logic
export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    private _isActive: boolean,
  ) {}

  static create(email: string): User {
    return new User(crypto.randomUUID(), email, true);
  }

  activate(): void {
    this._isActive = true;
  }

  get isActive(): boolean {
    return this._isActive;
  }
}
```

### Use Cases (Application Layer)

```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = User.create(dto.email);
      const savedUser = await this.userRepository.save(user);
      return new UserResponseDto(savedUser);
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new BadRequestException('User creation failed');
    }
  }
}
```

### Repository Interfaces (Domain)

```typescript
// Abstract interface in domain layer
export interface UserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

// Implementation in infrastructure layer
@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  // Implementation details
}
```

## Security & Validation Best Practices

### Global Pipes Configuration

```typescript
// In main.ts bootstrap
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip unknown properties
    forbidNonWhitelisted: true, // Throw error for unknown properties
    transform: true, // Auto-transform types
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

### Custom Decorators with Type Safety

```typescript
export const CurrentUser = createParamDecorator(
  (field: keyof User | undefined, ctx: ExecutionContext): User | any => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const user = request.user as User;

    return field ? user?.[field] : user;
  },
);

// Usage with type safety
@Get('profile')
getProfile(@CurrentUser() user: User): UserResponseDto {
  return new UserResponseDto(user);
}
```

## Error Handling Patterns

### Custom Exceptions

```typescript
export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`User with identifier ${identifier} not found`);
    this.name = 'UserNotFoundError';
  }
}

// Global exception filter
@Catch(UserNotFoundError)
export class UserNotFoundFilter implements ExceptionFilter {
  catch(exception: UserNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(404).send({
      statusCode: 404,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## Logging with Type Safety (Pino)

```typescript
@Injectable()
export class MyService {
  constructor(private readonly logger: Logger) {}

  async processUser(userId: string): Promise<void> {
    this.logger.log('Processing user', { userId, context: 'MyService' });

    try {
      // Process logic
      this.logger.log('User processed successfully', { userId });
    } catch (error) {
      this.logger.error('Failed to process user', {
        userId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
```

## Testing Patterns

### Unit Tests with Proper Mocking

```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        { provide: UserRepository, useValue: mockRepo },
        { provide: Logger, useValue: createMockLogger() },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    mockRepository = module.get(UserRepository);
  });

  it('should create user successfully', async () => {
    const dto = { email: 'test@example.com', age: 25 };
    const expectedUser = User.create(dto.email);

    mockRepository.save.mockResolvedValue(expectedUser);

    const result = await useCase.execute(dto);

    expect(result).toBeInstanceOf(UserResponseDto);
    expect(result.email).toBe(dto.email);
    expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({ email: dto.email }));
  });
});
```

### E2E Tests with Type Safety

```typescript
describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/users (POST) should create user', () => {
    const createUserDto = {
      email: 'test@example.com',
      age: 25,
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(createUserDto.email);
      });
  });
});
```

## Performance Considerations

### Lazy Loading and Async Patterns

```typescript
// Use lazy imports for better startup performance
@Module({
  imports: [import('./heavy-feature/heavy-feature.module').then(m => m.HeavyFeatureModule)],
})
export class AppModule {}

// Async configuration with proper typing
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        const dbConfig = configService.get<DatabaseConfig>('database')!;
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
```

## Enum and Constant Patterns

```typescript
// Use const assertions for immutable objects
export const HTTP_STATUS_MESSAGES = {
  OK: 'Success',
  CREATED: 'Resource created',
  BAD_REQUEST: 'Invalid request',
} as const;

// Use string enums for better debugging
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

// Type-safe environment validation
const REQUIRED_ENV_VARS = ['DATABASE_URL', 'JWT_SECRET'] as const;
type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];
```

## Import Organization

```typescript
// 1. Node.js built-ins
import { randomUUID } from 'crypto';

// 2. External libraries
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 3. Internal imports with path mapping
import { UserRepository } from '@modules/user/domain/repositories';
import { DatabaseConfig } from '@config/database';
import { CreateUserDto } from '@modules/user/application/dto';

// 4. Relative imports (avoid when possible)
import { UserEntity } from './user.entity';
```

These guidelines ensure type safety, maintainability, and consistency across the NestJS Fastify template while leveraging the full power of TypeScript's type system.

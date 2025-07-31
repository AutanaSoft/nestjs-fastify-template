# NestJS Fastify Template - Coding Instructions

## Language Guidelines

Always respond in Spanish when communicating with developers, but keep all code, comments, documentation, and technical content in English. This ensures consistency with international development standards while providing explanations in Spanish.

## File Creation Guidelines

Only create test files (`.spec.ts`, `.e2e-spec.ts`) or documentation files (`.md`) when explicitly requested by the developer. Focus on implementing core functionality and business logic unless specifically asked to add tests or documentation.

## Architecture Overview

This is a NestJS TypeScript template using Fastify as the HTTP adapter with production-ready security features, centralized configuration, and hexagonal architecture patterns.

### Key Components

- Platform: Fastify adapter (`@nestjs/platform-fastify`) with security plugins (helmet, CORS, CSRF, cookies)
- Configuration: Typed factory pattern with environment-aware defaults in `src/config/`
- Security: Global throttling, CORS whitelist, secure cookies, and correlation ID tracking
- Logging: Structured Pino logging with file rotation and environment-specific levels
- Architecture: Hexagonal/Clean Architecture with domain, application, and infrastructure layers

## Bootstrap Process

The application follows a specific initialization sequence in `src/main.ts`:

1. Create Fastify NestApplication with buffered logs
2. Load typed configurations from ConfigService
3. Register Fastify plugins (helmet, CORS, cookies, CSRF) in order
4. Apply global validation pipe with whitelist/transform
5. Setup Swagger documentation at `/docs`
6. Listen on configured port with startup logging

## Configuration System

All configuration is centralized in `src/config/` using typed factory pattern:

```typescript
export type MyConfig = {
  property: string;
};

export default registerAs(
  'myConfig',
  (): MyConfig => ({
    property: process.env.MY_PROPERTY || 'default',
  }),
);
```

Critical configs: appConfig (ports/env), corsConfig (whitelist), cookieConfig (security), throttlerConfig (rate limiting).
Register new configs in `AppModule.imports` ConfigModule.forRoot({ load: [...] }).

## Security Architecture

- Throttling: Global rate limiting via ThrottlerGuard (auto-disabled in tests)
- CORS: Environment-aware whitelist (`corsConfig.ts` - permissive in dev, strict in prod)
- Cookies: Adaptive security (`cookieConfig.ts` - signed/secure in prod, relaxed in dev)
- Correlation ID: Global interceptor for request tracing (`CorrelationIdInterceptor`)

## Module Structure (Hexagonal Architecture)

Follow this structure for new modules:

```
src/modules/moduleName/
├── module-name.module.ts    # Module registration (controllers + providers)
├── application/             # Application layer (use cases and DTOs)
│   ├── dto/                # Request/response DTOs with validation
│   │   ├── create-entity.dto.ts      # Creation DTOs
│   │   ├── update-entity.dto.ts      # Update DTOs
│   │   ├── entity-response.dto.ts    # Response DTOs
│   │   └── index.ts                  # Barrel exports
│   └── use-cases/          # Business logic orchestration
│       ├── create-entity.use-case.ts # Creation use cases
│       ├── find-entity.use-case.ts   # Query use cases
│       ├── update-entity.use-case.ts # Update use cases
│       ├── delete-entity.use-case.ts # Deletion use cases
│       └── index.ts                  # Barrel exports
├── domain/                 # Domain layer (pure business logic)
│   ├── entities/           # Domain entities
│   │   ├── entity.entity.ts          # Domain entity classes
│   │   └── index.ts                  # Barrel exports
│   ├── repositories/       # Repository interfaces (contracts)
│   │   ├── entity.repository.ts      # Abstract repository interface
│   │   └── index.ts                  # Barrel exports
│   ├── services/           # Domain services (business rules)
│   │   ├── entity-domain.service.ts  # Domain logic services
│   │   └── index.ts                  # Barrel exports
│   └── types/              # Domain types and interfaces
│       ├── entity.types.ts           # Type definitions
│       └── index.ts                  # Barrel exports
└── infrastructure/         # Infrastructure layer (external concerns)
    ├── adapters/           # Repository implementations and external APIs
    │   ├── entity-prisma.adapter.ts   # Prisma implementations
    │   ├── entity-redis.adapter.ts    # Cache implementations
    │   └── index.ts                   # Barrel exports
    └── controllers/        # HTTP controllers with Swagger docs
        ├── entity.controller.ts       # REST endpoints
        └── index.ts                   # Barrel exports

```

## Shared Module Structure

The shared module follows hexagonal architecture with clear separation of concerns:

```
src/shared/
├── application/            # Application layer
│   ├── decorators/         # Custom decorators
│   ├── dto/               # Common DTOs
│   └── services/          # Application services (correlation, audit, etc.)
├── domain/                # Domain layer (pure business logic)
│   ├── entities/          # Shared domain entities
│   ├── enums/             # Domain enums
│   ├── interfaces/        # Domain interfaces
│   ├── types/             # Domain types
│   └── value-objects/     # Value objects
├── infrastructure/        # Infrastructure layer
│   ├── adapters/          # External system adapters (Prisma, Redis, etc.)
│   ├── guards/            # NestJS guards
│   ├── interceptors/      # NestJS interceptors
│   ├── middleware/        # Express/Fastify middleware
│   ├── services/          # Infrastructure services (external APIs)
│   └── utils/             # Infrastructure utilities (bcrypt, crypto, etc.)
├── pino-logger.module.ts  # Pino logger configuration
├── shared.module.ts       # Shared module registration
└── index.ts              # Barrel exports
```

## Module Layer Responsibilities

### Application Layer (`application/`)

- **DTOs**: Data Transfer Objects with validation decorators
- **Use Cases**: Orchestrate business logic, handle transactions
- **No external dependencies**: Only domain and infrastructure interfaces

### Domain Layer (`domain/`)

- **Entities**: Core business objects with behavior
- **Repositories**: Abstract interfaces (contracts only)
- **Services**: Pure business logic, domain rules
- **Types**: Domain-specific types and interfaces
- **No framework dependencies**: Pure TypeScript/business logic

### Infrastructure Layer (`infrastructure/`)

- **Adapters**: Implement repository interfaces (Prisma, Redis, APIs)
- **Controllers**: HTTP endpoints, request/response handling
- **External dependencies**: Database, cache, third-party services

## Module Implementation Guidelines

### 1. Entity Example:

```typescript
// domain/entities/user.entity.ts
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly userName: string,
    public readonly status: UserStatus,
    public readonly role: UserRole,
  ) {}

  // Domain methods
  canUpdateProfile(): boolean {
    return this.status === UserStatus.ACTIVE;
  }
}
```

### 2. Repository Contract:

```typescript
// domain/repositories/user.repository.ts
export abstract class UserRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract create(data: CreateUserData): Promise<UserEntity>;
  abstract update(id: string, data: UpdateUserData): Promise<UserEntity>;
}
```

### 3. Use Case:

```typescript
// application/use-cases/create-user.use-case.ts
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Business logic orchestration
  }
}
```

### 4. Adapter Implementation:

```typescript
// infrastructure/adapters/user-prisma.adapter.ts
@Injectable()
export class UserPrismaAdapter extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<UserEntity | null> {
    // Prisma implementation
  }
}
```

## Services vs Utils Guidelines

**Use Services when:**

- Need dependency injection
- Complex business logic
- Stateful operations
- Integration with NestJS lifecycle
- Example: `CorrelationService`, `EmailService`, `CacheService`

**Use Utils when:**

- Stateless operations
- Simple helper functions
- External library wrappers
- No dependency injection needed
- Example: `HashUtils`, `DateUtils`, `StringUtils`

```typescript
// Service example (injectable)
@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}
  async sendEmail(to: string, template: string): Promise<void> { ... }
}

// Utils example (static methods)
export class HashUtils {
  static async hashPassword(password: string): Promise<string> { ... }
  static async comparePassword(password: string, hash: string): Promise<boolean> { ... }
}
```

## Development Commands

- `pnpm start:dev` - Development with hot reload and debug logging
- `pnpm test` - Full test suite (unit + e2e + coverage merge)
- `pnpm test:unit` - Unit tests only with coverage
- `pnpm test:e2e` - E2E tests with supertest
- `pnpm lint` - ESLint with auto-fix (flat config format)
- `pnpm format` - Prettier formatting

## Testing Strategy

- Unit tests: Located in `tests/src/` with TestingModule pattern
- E2E tests: Located in `tests/e2e/` using supertest against HTTP endpoints
- Coverage: Separate reports merged via `scripts/merge-coverage.ts`
- Jest config: Uses @swc/jest for fast compilation, covers all `src/**/*.(t|j)s`

## Code Quality Standards

- ESLint: Flat config with TypeScript strict rules, `@typescript-eslint/no-explicit-any: off`
- Commitlint: Enforced conventional commits with custom scope rules
- Validation: Global ValidationPipe with `whitelist: true, transform: true`
- Swagger: Automatic OpenAPI docs with `@ApiTags`, `@ApiOperation`, `@ApiResponse`

## Import Pattern

Use barrel exports with `index.ts` files for clean imports:

```typescript
// src/config/index.ts
export { default as appConfig, AppConfig } from './appConfig';
export { default as corsConfig } from './corsConfig';

// src/shared/infrastructure/utils/index.ts
export { HashUtils } from './hash.utils';

// src/modules/user/application/dto/index.ts
export { CreateUserDto } from './create-user.dto';
export { UpdateUserDto } from './update-user.dto';
export { UserResponseDto } from './user-response.dto';
```

This enables clean imports:

```typescript
import { appConfig, AppConfig } from '@config';
import { HashUtils } from '@shared/utils';
import { CreateUserDto, UserResponseDto } from '@modules/user/application/dto';
```

## Path Mapping

The project uses TypeScript path mapping for clean imports:

- `@/` - src/ directory
- `@config/` - src/config/
- `@shared/` - src/shared/
- `@modules/` - src/modules/
- `@shared/utils` - src/shared/infrastructure/utils/

## Environment Configuration

Development defaults: APP_PORT=4200, LOG_LEVEL=debug, permissive CORS
Production requirements: Set `APP_ENV=production`, `COOKIE_SECRET`, `CORS_ORIGIN_WHITELIST`

Key variables:

- `APP_PORT` (default: 4200) - Server port
- `APP_PREFIX` (default: 'v1') - API path prefix
- `APP_LOG_LEVEL` (default: 'debug') - Pino log level
- `CORS_ORIGIN_WHITELIST` - Comma-separated allowed origins
- `COOKIE_SECRET` - Required for signed cookies in production
- `THROTTLER_LIMIT/TTL` - Rate limiting configuration

## Testing Patterns

For E2E tests, always include ValidationPipe:

```typescript
const moduleFixture: TestingModule = await Test.createTestingModule({
  imports: [HelloModule],
}).compile();

app = moduleFixture.createNestApplication();
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

When adding modules, follow the hexagonal pattern with proper DTO validation, use cases, and comprehensive E2E tests.

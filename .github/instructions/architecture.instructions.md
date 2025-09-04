---
applyTo: '**'
---

# NestJS Best Practices with Fastify and Hexagonal Architecture

## 1. Project Structure

- Organize code in feature modules following hexagonal architecture
- Keep each layer (application, domain, infrastructure) isolated
- Use proper barrel exports only in subdirectories within each layer (not in the layer directories themselves)
- Follow the defined folder structure:

### Module Structure (Hexagonal Architecture)

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

### Shared Module Structure

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
└── shared.module.ts       # Shared module registration
```

## 2. Domain Layer

- Keep domain logic pure and framework-agnostic
- Define clear interfaces in ports directory
- Use value objects for complex attributes
- Implement domain events for cross-cutting concerns
- Keep entities focused and immutable where possible
- Define clear domain errors
- Use proper typing for all domain objects

## 3. Application Layer

- Implement use cases as application services
- Keep application services focused on orchestration
- Use proper DTOs for input/output
- Implement CQRS pattern when beneficial
- Handle domain events
- Validate inputs using class-validator
- Map between domain and DTOs using class-transformer

## 4. Infrastructure Layer

- Implement repository interfaces from domain
- Keep Fastify-specific code in infrastructure
- Implement proper GraphQL resolvers using Mercurius
- Use proper dependency injection
- Handle infrastructure concerns (caching, logging)
- Implement proper error handling
- Use proper database abstractions

## 5. GraphQL with Mercurius

- Keep resolvers thin and focused
- Use proper dataloader implementation
- Handle N+1 query problems
- Implement proper schema organization
- Use proper type definitions
- Handle subscriptions properly
- Implement proper validation

## 6. Dependency Injection

- Use constructor injection
- Inject domain ports, not implementations
- Use proper provider tokens
- Handle circular dependencies properly
- Use proper scope (DEFAULT, REQUEST, TRANSIENT)
- Implement proper factory providers
- Configure providers at infrastructure layer

## 7. Error Handling

- Define domain-specific errors
- Use proper exception filters
- Implement proper error mapping
- Handle infrastructure errors properly
- Use proper logging
- Implement proper validation
- Return proper GraphQL errors

## 8. Validation and DTOs

- Use class-validator for input validation
- Implement proper transformation
- Keep DTOs immutable
- Use proper inheritance for shared validations
- Implement custom validators when needed
- Use proper validation groups
- Handle validation errors properly

## 9. Testing

- Test domain logic in isolation
- Implement proper integration tests
- Use proper test doubles (mocks, stubs)
- Test infrastructure adapters
- Implement proper e2e tests
- Use proper test databases
- Test GraphQL resolvers properly

## 10. Performance

- Use proper caching strategies
- Implement proper database optimizations
- Use proper GraphQL query optimization
- Handle N+1 queries properly
- Monitor performance metrics
- Use proper connection pooling
- Implement proper batching

## 11. Security

- Implement proper authentication
- Use proper authorization
- Handle sensitive data properly
- Implement proper rate limiting
- Use proper security headers
- Validate all inputs
- Implement proper audit logging

## 12. Configuration

- Use proper environment variables
- Implement proper configuration service
- Handle secrets properly
- Use proper configuration validation
- Implement proper defaults
- Use proper configuration namespaces
- Keep configurations organized

## 13. Development Workflow

- Use proper version control
- Implement proper CI/CD
- Use proper linting and formatting
- Keep dependencies up to date
- Monitor performance
- Use proper logging
- Document API properly

## 14. Configuration System

- Centralize configuration in `src/config/`, one file per concern.
- Use `registerAs('<namespace>')` with a typed factory; the namespace must match the filename in lower camelCase.
- Export a type per config and prefer `readonly` properties.
- Environment variables in SCREAMING_SNAKE_CASE; explicit and scoped names.
- Provide defaults only for development; never for secrets/credentials.
- Explicit parsing: numbers, booleans, arrays, and URLs (with validation).
- Validate on startup and fail fast; strip unknown keys (schema-based validator).
- Register with `ConfigModule.forRoot` (global, cache, load, envFilePath); in production use `ignoreEnvFile: true`.
- Keep factories pure and side-effect free.
- Do not log secrets; redact sensitive fields.
- Use typed access (`ConfigType<typeof ...>`) and avoid magic strings with `ConfigService`.
- Use environment overlays via `.env` files with clear precedence.
- Maintain a barrel export in `src/config/index.ts`.
- Document variables and handle deprecations with a temporary fallback and a single startup warning.

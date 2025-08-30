---
applyTo: '**'
---

# General Coding Standards

## Naming Conventions

- Use PascalCase for classes, interfaces, types, enums, and decorators
- Use camelCase for variables, functions, methods, and properties
- Use kebab-case for file names and directory names
- Use SCREAMING_SNAKE_CASE for constants and environment variables
- Prefix private class members with underscore (\_)
- Suffix DTOs with `Dto`, entities with `Entity`, services with `Service`

### Hexagonal Architecture Conventions

- **Resolvers**: `EntityResolver` (e.g., `UserResolver`)
- **Use Cases**: `VerbEntityUseCase` (e.g., `CreateUserUseCase`)
- **Domain Services**: `EntityDomainService` (e.g., `UserDomainService`)
- **Repository Interfaces**: `EntityRepository` (e.g., `UserRepository`)
- **Repository Implementations**: `EntityPrismaAdapter` (e.g., `UserPrismaAdapter`)
- **Domain Events**: `EntityVerbedEvent` (e.g., `UserCreatedEvent`)
- **Domain Exceptions**: `EntityDomainException` (e.g., `UserNotFoundDomainException`)

## File Organization

- Group related files in feature modules following hexagonal architecture
- Use barrel exports with `index.ts` files for clean imports
- Place configuration files in `src/config/` with typed factory pattern
- Store shared utilities in `src/shared/` organized by layer (domain/application/infrastructure)

## Import Organization

- Node.js built-ins first
- External libraries second
- Internal imports with path mapping third (`@/`, `@config/`, `@shared/`, `@modules/`)
- Relative imports last (avoid when possible)

## Error Handling

- Use try/catch blocks for all async operations
- Implement custom exception classes extending built-in Error
- Use NestJS exception filters for global error handling
- Always log errors with structured context using Pino logger
- Include correlation IDs for request tracing
- Throw specific HTTP exceptions (BadRequestException, NotFoundException, etc.)

### Domain Error Handling

- Create domain-specific exceptions extending Error class
- Use consistent error codes and messages across domain
- Map domain errors to appropriate GraphQL errors
- Use GraphQLError with proper extensions for client consumption
- Implement error boundaries for different layers
- Never leak infrastructure errors to domain layer

### GraphQL Error Handling

- Use `GraphQLError` with proper error codes and extensions
- Map domain exceptions to appropriate GraphQL error types
- Implement proper error formatting for consistent client experience
- Handle validation errors with field-level error details
- Use proper HTTP status codes for GraphQL over HTTP transport

## Logging Standards

- Use structured logging with Pino logger
- Include context information (userId, correlationId, method, etc.)
- Log at appropriate levels: error, warn, info, debug
- Never log sensitive information (passwords, tokens, etc.)
- Use consistent log message format across modules
- Include correlation IDs for request tracing across services
- Log GraphQL operation names and execution times for monitoring

## Security Practices

- Validate all input data using class-validator decorators
- Use whitelist validation to strip unknown properties
- Implement proper authentication and authorization guards
- Enable CORS with explicit origin whitelist for production
- Use secure cookie configuration based on environment
- Apply rate limiting with throttler guards

## Configuration Management

- Use typed configuration with `registerAs` factory pattern
- Provide sensible defaults for development environment
- Validate required environment variables on startup
- Use readonly properties for configuration objects
- Centralize all configuration in `src/config/` directory

## Testing Standards

- Write unit tests for business logic and use cases
- Write E2E tests for HTTP endpoints
- Use TestingModule pattern for NestJS testing
- Mock external dependencies properly with jest.Mock
- Include ValidationPipe in E2E test setup
- Maintain separate coverage reports for unit and E2E tests

## GraphQL with Mercurius

- Keep resolvers thin and focused on orchestration
- Use DataLoader pattern to avoid N+1 query problems
- Implement proper schema organization with modular approach
- Use field resolvers for complex computed properties
- Implement proper subscription handling for real-time features
- Use proper error handling with GraphQLError extensions
- Implement query complexity analysis for performance protection
- Use proper caching strategies at resolver level when appropriate
- Handle authentication and authorization at resolver level
- Implement proper input validation using DTOs
- Use proper type safety with TypeScript and GraphQL schema-first approach

## Dependency Injection

- Use constructor injection for required dependencies
- Mark injected dependencies as readonly
- Prefer interface-based injection over concrete classes
- Use proper scopes for providers (Singleton, Request, Transient)
- Organize providers by feature modules

## Dependency Injection by Layers

### Domain Layer

- Inject only interfaces (ports), never implementations
- Use dependency injection tokens for abstractions
- Keep domain services pure and testable
- Use factory pattern for complex object creation
- Avoid framework-specific dependencies in domain layer

### Application Layer

- Inject use cases in resolvers and controllers
- Inject domain services and repositories via interfaces
- Use proper scoping (REQUEST for user context, SINGLETON for stateless services)
- Handle cross-cutting concerns with interceptors and guards
- Implement proper transaction management

### Infrastructure Layer

- Implement all domain interfaces with concrete adapters
- Register providers with appropriate tokens and scopes
- Configure database connections and external services
- Handle infrastructure-specific error mapping
- Implement proper connection pooling and resource management

## Performance and Optimization

### GraphQL Performance

- Use DataLoader for batching database queries to avoid N+1 problems
- Implement query complexity analysis and limits to prevent expensive operations
- Use proper field-level caching where appropriate
- Monitor resolver performance and optimize bottlenecks
- Use proper database query optimization with Prisma select fields
- Implement proper pagination for large datasets
- Use subscription filtering to reduce unnecessary data transmission

### Database Optimization

- Use select fields in Prisma to avoid over-fetching data
- Implement proper pagination with cursor-based or offset-based approaches
- Use database indexes for frequently queried fields
- Monitor query performance and optimize N+1 problems with includes/select
- Use connection pooling appropriately for concurrent requests
- Implement proper database transaction management
- Use proper foreign key relationships and constraints

### Caching Strategies

- Implement Redis for application-level caching
- Use appropriate TTL based on data volatility
- Cache at use case level, not infrastructure level
- Implement cache invalidation strategies for data consistency
- Use proper cache keys with namespacing
- Monitor cache hit rates and effectiveness

## Code Quality

- Use ESLint with TypeScript strict rules
- Format code with Prettier
- Follow conventional commit message format
- Prefer composition over inheritance
- Keep functions small and focused on single responsibility
- Use TypeScript strict mode features
- Always consult project instructions before generating or modifying code
- Ask for confirmation before implementing improvements or changes not explicitly specified
- Be transparent about uncertainties and seek clarification when instructions are ambiguous
- Project instructions are the authoritative source of truth for all development decisions
- Implement proper type safety across all layers
- Use readonly properties for immutable data structures
- Leverage discriminated unions for type safety in complex scenarios

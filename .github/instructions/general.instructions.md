---
applyTo: '**'
---

# NestJS Fastify Template - General Coding Standards

## Naming Conventions

- Use PascalCase for classes, interfaces, types, enums, and decorators
- Use camelCase for variables, functions, methods, and properties
- Use kebab-case for file names and directory names
- Use SCREAMING_SNAKE_CASE for constants and environment variables
- Prefix private class members with underscore (\_)
- Suffix DTOs with `Dto`, entities with `Entity`, services with `Service`

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

## Logging Standards

- Use structured logging with Pino logger
- Include context information (userId, correlationId, method, etc.)
- Log at appropriate levels: error, warn, info, debug
- Never log sensitive information (passwords, tokens, etc.)
- Use consistent log message format across modules

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

## Code Quality

- Use ESLint with TypeScript strict rules
- Format code with Prettier
- Follow conventional commit message format
- Prefer composition over inheritance
- Keep functions small and focused on single responsibility
- Use TypeScript strict mode features

## Performance Guidelines

- Use async/await for non-blocking operations
- Implement lazy loading for heavy modules
- Configure Fastify plugins in proper order
- Use connection pooling for database connections
- Enable response compression for production
- Monitor memory usage and optimize where needed

## Dependency Injection

- Use constructor injection for required dependencies
- Mark injected dependencies as readonly
- Prefer interface-based injection over concrete classes
- Use proper scopes for providers (Singleton, Request, Transient)
- Organize providers by feature modules

## Type Safety

- Use strict TypeScript configuration
- Prefer explicit types over `any`
- Use generic types for reusable code
- Implement proper type guards for runtime validation
- Use readonly properties where immutability is required
- Leverage union types and discriminated unions

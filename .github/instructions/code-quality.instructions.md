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

## Dependency Injection

- Use constructor injection for required dependencies
- Mark injected dependencies as readonly
- Prefer interface-based injection over concrete classes
- Use proper scopes for providers (Singleton, Request, Transient)
- Organize providers by feature modules

## Configuration Management

- Use typed configuration with `registerAs` factory pattern
- Provide sensible defaults for development environment
- Validate required environment variables on startup
- Use readonly properties for configuration objects
- Centralize all configuration in `src/config/` directory

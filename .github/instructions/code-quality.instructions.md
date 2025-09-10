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
- Use barrel exports with `index.ts` files only in subdirectories within each layer (not in the layer directories themselves)
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

## Language Guidelines

- Always respond in Spanish when communicating with developers
- Use English for all code and technical documentation:
  - **Comprehensive JSDoc documentation** for all classes, methods, and functions
  - **Concise inline comments** for complex business logic - short and specific explanations
  - Component descriptions and architectural context
  - Type and interface definitions with descriptions

### JSDoc Documentation Standards

- **Classes**: Document purpose, architectural role, and usage context
- **Methods**: Include description, architectural context, parameters, returns, and exceptions
- **Properties**: Use concise, single-line descriptions focusing on essential information
- **Multi-paragraph structure**: Separate general description, detailed explanation, and usage notes
- **Use JSDoc tags**: `@param`, `@returns`, `@throws` when applicable
- **Include architectural context**: Explain how the component fits in hexagonal architecture
- **Business context**: Explain the business purpose and validation rules
- **Parameter documentation**: Reference the interface or type being used instead of documenting individual properties
- **Avoid code examples**: Keep documentation focused on purpose and behavior, not implementation examples
- **Concise descriptions**: Provide comprehensive information without excessive verbosity

#### Property Documentation Guidelines

- **Concise documentation**: Use single-line descriptive comments for each property
- **Essential information**: Include only the most important and necessary data
- **Immediate clarity**: Provide direct descriptions without extensive paragraphs
- **Consistent formatting**: Maintain uniform format across all properties
- **Avoid redundancy**: Don't repeat information that's obvious from the type or name

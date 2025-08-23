---
applyTo: '**/*.ts'
---

# Prisma Best Practices

## 1. Schema Design

- Use descriptive and consistent names for models and fields
- Implement bidirectional relationships when necessary
- Define appropriate indexes to optimize queries
- Maintain referential integrity through constraints
- Document the schema with clear comments
- Use appropriate and precise data types
- Implement default values when it makes sense

## 2. Model Relationships

- Design relationships based on business requirements
- Avoid unnecessary circular relationships
- Use cascades with caution
- Implement indexes on foreign keys
- Consider relationship cardinality
- Document the purpose of each relationship

## 3. Database Operations

- Use transactions for atomic operations
- Implement the Repository pattern
- Avoid N+1 queries through appropriate includes
- Use batch operations when possible
- Implement soft deletes when appropriate
- Handle database errors properly

## 4. Performance

- Optimize queries through specific field selection
- Use indexes appropriately
- Implement pagination for large datasets
- Avoid unnecessary nested queries
- Use caching when appropriate
- Monitor and optimize slow queries
- Implement lazy loading strategies

## 5. Migrations

- Keep migrations atomic and reversible
- Document changes in each migration
- Test migrations in development environment
- Maintain a clean migration history
- Implement rollback strategies
- Version migrations
- Coordinate migrations in teams

## 6. Security

- Implement input validation
- Use enumerated types for fixed values
- Implement model-level access control
- Protect sensitive data
- Implement change auditing
- Use middleware for logging
- Follow the principle of least privilege

## 7. Error Handling

- Implement consistent error handling
- Use custom error types
- Appropriate error logging
- Validate input data
- Handle edge cases appropriately
- Implement rollback on error
- Provide useful error messages

## 8. Testing

- Write unit tests for CRUD operations
- Implement integration tests
- Use test databases
- Mock Prisma client when necessary
- Test edge cases and errors
- Maintain consistent test data
- Implement reusable fixtures

## 9. Code Organization

- Separate business logic from data access
- Implement the Repository pattern
- Keep services atomic and cohesive
- Use DTOs for data transfer
- Implement mappers when necessary
- Maintain a clear folder structure
- Follow SOLID principles

## 10. Development Workflow

- Use Prisma CLI tools effectively
- Keep schema.prisma organized
- Implement schema validation
- Use type generator
- Keep documentation up to date
- Follow team conventions
- Review and optimize queries regularly

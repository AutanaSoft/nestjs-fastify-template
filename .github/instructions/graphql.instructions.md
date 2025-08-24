---
applyTo: '**/*.ts'
---

# GraphQL Best Practices with Mercurius

## 1. Schema Design

- Use clear and descriptive type names
- Follow naming conventions (PascalCase for types, camelCase for fields)
- Keep types focused and cohesive
- Use interfaces for shared fields
- Implement proper input validation
- Use enums for fixed values
- Document types and fields with descriptions

## 2. Resolvers

- Keep resolvers simple and focused
- Use proper error handling
- Implement proper authorization
- Use dataloader for N+1 query prevention
- Validate input data
- Use proper typing
- Implement proper caching strategies

## 3. Performance

- Use proper field selection
- Implement dataloader pattern
- Use proper caching strategies
- Monitor query complexity
- Implement proper batching
- Use proper pagination
- Optimize nested queries

## 4. Security

- Implement proper authentication
- Use proper authorization
- Validate input data
- Implement rate limiting
- Use proper error handling
- Protect against malicious queries
- Monitor query complexity

## 5. Error Handling

- Use proper error types
- Implement proper error messages
- Handle edge cases
- Log errors appropriately
- Return proper error responses
- Implement proper validation
- Use proper error codes

## 6. Testing

- Write unit tests for resolvers
- Implement integration tests
- Test error scenarios
- Use proper mocking
- Test performance
- Test security
- Implement proper test coverage

## 7. Code Organization

- Use proper folder structure
- Separate concerns properly
- Use proper naming conventions
- Implement proper documentation
- Use proper typing
- Follow best practices
- Keep code DRY

## 8. Subscriptions

- Implement proper PubSub
- Handle subscription cleanup
- Use proper authentication
- Implement proper error handling
- Monitor subscription performance
- Use proper filtering
- Handle disconnections properly

## 9. Documentation

- Document types and fields
- Use proper descriptions
- Document mutations and queries
- Document subscriptions

## 10. Development Workflow

- Use proper version control
- Implement proper CI/CD
- Use proper linting
- Implement proper formatting
- Keep schema in sync
- Monitor performance
- Use proper logging

---
applyTo: '**'
---

# Testing Best Practices

## 1. Unit Testing

- Test domain logic in isolation
- Use proper test doubles (mocks, stubs, spies)
- Follow AAA pattern (Arrange, Act, Assert)
- Test one concept per test
- Use meaningful test descriptions
- Keep tests focused and simple
- Implement proper test coverage

## 2. Integration Testing

- Test infrastructure adapters
- Test database operations
- Test external service integrations
- Use proper test databases
- Implement proper test data seeding
- Test error scenarios
- Clean up test data properly

## 3. E2E Testing

- Test complete user flows
- Test GraphQL resolvers
- Test REST endpoints
- Test authentication flows
- Test authorization scenarios
- Use proper test environment
- Implement proper test data

## 4. Testing Tools and Setup

- Use Jest for unit and integration tests
- Implement proper test runners
- Use proper test configuration
- Set up proper test environment
- Use proper test utilities
- Implement proper test helpers
- Use proper assertion libraries

## 5. Test Data Management

- Use factories for test data
- Implement proper fixtures
- Use proper test databases
- Clean up test data
- Use proper data seeding
- Implement proper data isolation
- Use meaningful test data

## 6. GraphQL Testing

- Test queries and mutations
- Test resolvers in isolation
- Test dataloader implementation
- Test N+1 query prevention
- Test error scenarios
- Test subscriptions
- Test schema validation

## 7. Database Testing

- Use test transactions
- Implement proper rollbacks
- Test database constraints
- Test database triggers
- Test database indexes
- Test database performance
- Use proper test isolation

## 8. Mocking and Stubbing

- Mock external dependencies
- Use proper stub implementations
- Mock database connections
- Mock HTTP requests
- Mock file system operations
- Implement proper spy objects
- Use proper fake implementations

## 9. Performance Testing

- Test response times
- Test under load
- Test memory usage
- Test database performance
- Test caching strategies
- Test concurrent operations
- Monitor test metrics

## 10. Security Testing

- Test authentication flows
- Test authorization rules
- Test input validation
- Test SQL injection prevention
- Test XSS prevention
- Test CSRF protection
- Test rate limiting

## 11. Test Organization

- Use proper test folder structure
- Group related tests
- Use proper naming conventions
- Implement proper test suites
- Use proper test categories
- Keep tests maintainable
- Document test requirements

## 12. Test Automation

- Implement CI/CD integration
- Use proper test runners
- Automate test execution
- Generate test reports
- Monitor test coverage
- Implement test notifications
- Use proper test scheduling

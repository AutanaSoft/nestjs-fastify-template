---
applyTo: '**/*.ts'
---

# Security Best Practices

## 1. Authentication

- Use Passport.js with JWT strategy for authentication
- Implement secure token management
  - Use short-lived access tokens (15 minutes)
  - Use longer-lived refresh tokens (7 days)
  - Implement token rotation
  - Store tokens in secure HTTP-only cookies
  - Use proper token validation

- Follow secure session practices
  - Implement proper session management
  - Use secure session storage
  - Handle session expiration
  - Implement session invalidation

- Implement secure password policies
  - Use strong password hashing (bcrypt)
  - Enforce password complexity
  - Implement secure password reset
  - Consider MFA implementation

- Handle authentication flows securely
  - Implement secure login/logout
  - Use proper token refresh mechanism
  - Handle concurrent sessions
  - Implement proper rate limiting

## 2. Authorization

- Implement role-based access control (RBAC)
- Use fine-grained permissions
- Implement proper access control checks
- Use declarative authorization
- Implement proper role hierarchy
- Use proper guard chains
- Validate permissions at all levels

## 3. Data Protection

- Encrypt sensitive data at rest
- Use proper data masking
- Implement input sanitization
- Handle PII data properly
- Use strong encryption algorithms
- Implement proper key rotation
- Follow data classification policies

## 4. Input Validation

- Validate all user inputs
- Use strong validation rules
- Implement proper sanitization
- Use validation decorators
- Implement custom validators
- Handle validation errors properly
- Use proper validation schemas

## 5. API Security

- Implement proper rate limiting
- Use proper authentication
- Handle versioning securely
- Configure CORS properly
- Use security headers
- Handle errors securely
- Monitor API usage

## 6. Database Security

- Use secure connection strings
- Implement proper access control
- Use query parameterization
- Handle errors securely
- Use connection pooling
- Implement proper backups
- Monitor database access

## 7. GraphQL Security

- Implement depth limiting
- Use query complexity analysis
- Handle batching securely
- Use persisted queries
- Implement error masking
- Control introspection
- Monitor operations

## 8. Infrastructure Security

- Use proper network security
- Configure firewalls properly
- Use TLS/SSL
- Handle infrastructure errors
- Implement proper logging
- Use security monitoring
- Implement access controls

## 9. Audit and Logging

- Maintain audit trails
- Use structured logging
- Protect sensitive log data
- Implement log rotation
- Use proper log formats
- Monitor security events
- Configure proper alerting

## 10. Session Management

- Use secure session storage
- Implement proper timeouts
- Handle session invalidation
- Use secure session options
- Implement cleanup routines
- Monitor session activity
- Handle concurrent sessions

## 11. Error Handling

- Handle errors securely
- Use proper error messages
- Implement secure logging
- Protect sensitive data
- Use proper error responses
- Monitor security errors
- Implement error recovery

## 12. Security Testing

- Perform security testing
- Use penetration testing
- Test security configs
- Test auth flows
- Validate security rules
- Monitor security metrics
- Test security updates

---
applyTo: '**/*.ts'
---

# Database Best Practices with Prisma

## 1. Prisma Client Configuration

### Client Instance Management

- Use singleton pattern for PrismaClient instance in infrastructure layer
- Configure proper connection pooling based on environment
- Implement graceful shutdown handling with `$disconnect()`
- Use environment-based configuration for database URLs
- Enable logging for development: `log: ['query', 'info', 'warn', 'error']`

### Type Safety with Prisma

- Leverage Prisma generated types: `Prisma.UserCreateInput`, `Prisma.UserWhereInput`
- Use `Prisma.validator()` for complex type validations
- Implement proper return types using `Prisma.UserGetPayload<>`
- Use `$Enums` for enum types from Prisma schema

### Query Patterns

```typescript
// Specific field selection
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, name: true },
});

// Include relations efficiently
const userWithPosts = await prisma.user.findUnique({
  where: { id },
  include: { posts: { select: { title: true, publishedAt: true } } },
});
```

## 2. Repository Pattern with Prisma (Hexagonal Architecture)

### Infrastructure Layer Implementation

- Implement domain repository interfaces with Prisma adapters
- Keep Prisma-specific code only in infrastructure layer
- Use dependency injection tokens for repository abstractions
- Never expose Prisma models directly to domain layer

### Repository Adapter Pattern

```typescript
@Injectable()
export class UserPrismaAdapter implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomainEntity(user) : null;
  }

  private toDomainEntity(prismaUser: User): UserEntity {
    // Map Prisma model to domain entity
  }
}
```

### Domain Entity Mapping

- Use mappers to convert between Prisma models and domain entities
- Keep domain entities pure and framework-agnostic
- Implement bidirectional mapping (to/from domain)
- Handle optional fields and relations properly

## 3. Prisma Schema Best Practices

### Model Design

- Use descriptive and consistent naming: PascalCase for models, camelCase for fields
- Implement bidirectional relationships with proper `@relation` attributes
- Define appropriate indexes using `@@index([field1, field2])`
- Use `@@unique` constraints for business rules
- Document models with `/// Comments` for schema documentation

### Field Types and Constraints

- Use precise data types: `String @db.VarChar(255)` instead of generic `String`
- Implement default values appropriately: `createdAt DateTime @default(now())`
- Use enums for fixed values: `enum UserRole { ADMIN USER GUEST }`
- Add validation at schema level where possible

### Relationships and Foreign Keys

```prisma
model User {
  id       String @id @default(cuid())
  email    String @unique
  posts    Post[]
  profile  Profile?

  @@map("users")
}

model Post {
  id       String @id @default(cuid())
  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([authorId])
  @@map("posts")
}
```

## 4. Database Documentation Standards

### Repository Adapter Documentation

- **All adapter classes** must include JSDoc describing their architectural role
- **Database operations** must document transaction behavior and error handling
- **Include Prisma-specific considerations**: Model transformations, query optimization
- **Document business constraints**: Unique validations, relationships, and cascade behavior

### Schema Documentation Requirements

- **Prisma models**: Use `/// Comments` for schema documentation
- **Field documentation**: Explain business purpose, validation rules, and relationships
- **Migration documentation**: Document breaking changes and migration impacts
- **Index documentation**: Explain performance rationale and query patterns

## 5. Transaction Management

### Interactive Transactions

- Use `$transaction()` for complex operations requiring atomicity
- Implement proper error handling within transactions
- Keep transactions short and focused
- Use sequential operations within transactions when needed

```typescript
async createUserWithProfile(userData: CreateUserInput): Promise<UserEntity> {
  return await this.prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: userData.email, name: userData.name }
    })

    const profile = await tx.profile.create({
      data: { userId: user.id, ...userData.profile }
    })

    return this.toDomainEntity({ ...user, profile })
  })
}
```

### Batch Operations

- Use `createMany`, `updateMany`, `deleteMany` for bulk operations
- Implement `upsert` for create-or-update scenarios
- Use `findMany` with proper pagination for large datasets
- Consider performance implications of batch sizes

## 6. Performance Optimization

### Query Optimization

- Use `select` to fetch only required fields
- Use `include` with nested `select` for relations
- Implement proper pagination with `cursor` or `skip`/`take`
- Avoid N+1 queries with strategic `include` statements

```typescript
// Optimized query with selective fields
const users = await this.prisma.user.findMany({
  select: {
    id: true,
    email: true,
    posts: {
      select: { id: true, title: true },
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    },
  },
  take: 10,
  cursor: cursor ? { id: cursor } : undefined,
});
```

### Indexing Strategy

- Add indexes for frequently queried fields
- Use composite indexes for multi-field queries
- Monitor query performance with Prisma logging
- Use database-specific optimizations when needed

### Caching Implementation

- Cache frequently accessed data at repository level
- Use Redis for application-level caching
- Implement cache invalidation strategies
- Consider GraphQL DataLoader pattern for batching

## 7. Prisma Migrate Best Practices

### Migration Management

- Keep migrations atomic and reversible
- Use descriptive migration names: `prisma migrate dev --name add_user_profile_relation`
- Test migrations in development before production
- Maintain a clean migration history
- Document breaking changes in migration files
- Coordinate migrations in team environments

### Schema Evolution

- Plan schema changes carefully to avoid breaking changes
- Use gradual migrations for large schema modifications
- Implement data migrations when needed
- Back up data before significant migrations
- Use `prisma db push` only for prototyping

### Production Migrations

- Review generated SQL before applying to production
- Use `prisma migrate deploy` for production deployments
- Monitor migration performance on large tables
- Implement rollback strategies for critical changes

## 8. Security and Data Protection

### Input Validation and Sanitization

- Validate all input data before database operations
- Use Prisma's built-in type safety as first line of defense
- Implement business rules validation in domain layer
- Sanitize user input to prevent injection attacks
- Use parameterized queries (Prisma handles this automatically)

### Access Control and Authorization

- Implement row-level security when needed
- Use Prisma middleware for audit logging
- Implement field-level access control in resolvers/controllers
- Follow principle of least privilege for database connections
- Protect sensitive fields with selective queries

```typescript
// Implement audit logging middleware
prisma.$use(async (params, next) => {
  if (params.action === 'create' || params.action === 'update') {
    params.args.data.updatedAt = new Date();
    params.args.data.updatedBy = getCurrentUserId(); // from context
  }
  return next(params);
});
```

### Data Encryption and Privacy

- Encrypt sensitive data at application level before storing
- Use database-level encryption for highly sensitive data
- Implement data anonymization for development environments
- Handle GDPR compliance with data deletion capabilities

## 9. Prisma Error Handling

### Known Prisma Error Types

- Handle `PrismaClientKnownRequestError` for database constraint violations
- Handle `P2002` (unique constraint violation) appropriately
- Handle `P2025` (record not found) for missing entities
- Handle `P2003` (foreign key constraint failed) for relationship errors
- Map Prisma errors to domain exceptions

```typescript
async findById(id: string): Promise<UserEntity> {
  try {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } })
    return this.toDomainEntity(user)
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new UserNotFoundDomainException(`User with id ${id} not found`)
      }
    }
    throw new DatabaseInfrastructureException('Unexpected database error', error)
  }
}
```

### Error Boundaries and Recovery

- Implement proper error boundaries between layers
- Never leak Prisma-specific errors to domain layer
- Use proper error classification and mapping
- Implement circuit breaker pattern for external dependencies
- Log errors with appropriate context and correlation IDs

### Connection and Transaction Errors

- Handle connection timeout errors gracefully
- Implement retry logic for transient failures
- Handle transaction deadlock and serialization failures
- Implement proper cleanup on transaction failures

## 10. Testing Strategies with Prisma

### Unit Testing Repository Adapters

- Mock PrismaService for isolated unit tests
- Test domain entity mapping logic separately
- Use `jest.MockedClass<PrismaService>` for type safety
- Test error handling scenarios with mocked failures

```typescript
describe('UserPrismaAdapter', () => {
  let adapter: UserPrismaAdapter;
  let prismaService: jest.MockedClass<typeof PrismaService>;

  beforeEach(() => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as any;
    adapter = new UserPrismaAdapter(mockPrisma);
  });
});
```

### Integration Testing with Test Database

- Use separate test database for integration tests
- Implement database seeding for consistent test data
- Use `prisma migrate reset` before test suites
- Clean up test data after each test run
- Test actual database operations and constraints

### E2E Testing Database Operations

- Test complete flows from GraphQL/REST to database
- Use transaction rollback for test isolation
- Test migration scenarios in E2E environment
- Verify data consistency across related entities

## 11. Code Organization and Architecture

### Hexagonal Architecture Integration

- Keep Prisma adapters in `infrastructure/adapters/` directory
- Implement domain repository interfaces in `domain/repositories/`
- Use dependency injection to wire repositories to use cases
- Separate entity mapping logic into dedicated mapper classes
- Follow naming convention: `EntityPrismaAdapter`

### Layer Separation

```
domain/
├── entities/user.entity.ts        # Pure domain entity
├── repositories/user.repository.ts # Repository interface
└── types/user.types.ts            # Domain types

infrastructure/
├── adapters/user-prisma.adapter.ts # Prisma implementation
└── mappers/user.mapper.ts          # Entity mapping logic
```

### Service and Mapper Organization

- Keep repository adapters focused on data access only
- Implement separate mapper classes for complex transformations
- Use dependency injection for all database-related services
- Follow SOLID principles in repository implementations
- Maintain clear boundaries between layers

### Configuration and Connection Management

- Centralize Prisma configuration in infrastructure layer
- Use PrismaService as singleton for connection management
- Implement proper lifecycle management (onModuleDestroy)
- Configure connection pooling based on environment

## 12. Development Workflow and Tools

### Prisma CLI Best Practices

- Use `prisma generate` after schema changes
- Run `prisma db push` for rapid prototyping
- Use `prisma studio` for database inspection during development
- Keep `prisma format` in pre-commit hooks
- Use `prisma validate` to check schema integrity

### Schema Management

- Keep schema.prisma well-organized with consistent formatting
- Group related models together in schema file
- Use comments to document business rules and relationships
- Version control all schema changes with descriptive commit messages
- Review schema changes in team pull requests

### Database Monitoring and Optimization

- Enable query logging in development
- Monitor slow queries and optimize with proper indexes
- Use database performance monitoring tools
- Regular review of query patterns and optimization opportunities
- Document performance improvements and lessons learned

### Team Collaboration

- Establish migration naming conventions
- Coordinate schema changes with team members
- Use feature branches for database schema changes
- Document breaking changes and migration impacts
- Implement database change review process

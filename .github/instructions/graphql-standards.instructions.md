---
applyTo: '**/*.ts'
---

# GraphQL Best Practices with Mercurius

## 1. GraphQL Schema Design with Mercurius

### Type Definitions and Naming

- Use PascalCase for types, interfaces, and enums: `User`, `UserProfile`, `UserRole`
- Use camelCase for fields and arguments: `firstName`, `createdAt`, `isActive`
- Use descriptive and business-focused names: `UserCreateInput` not `CreateUserDto`
- Keep types focused and cohesive following domain boundaries
- Use GraphQL descriptions for self-documenting schema

```typescript
// Domain-focused type definition
type User {
  """Unique identifier for the user"""
  id: ID!
  """User's email address"""
  email: String!
  """User's display name"""
  name: String!
  """User creation timestamp"""
  createdAt: DateTime!
  """User's posts"""
  posts: [Post!]!
}
```

### Input Types and Validation

- Create specific input types for mutations: `UserCreateInput`, `UserUpdateInput`
- Use enums for constrained values: `enum UserRole { ADMIN, USER, GUEST }`
- Implement field-level validation with custom scalars when needed
- Use interfaces for shared fields across types

```typescript
input UserCreateInput {
  email: String!
  name: String!
  role: UserRole = USER
}

enum UserRole {
  ADMIN
  USER
  GUEST
}
```

## 2. Resolver Implementation with Hexagonal Architecture

### Resolver Structure in Infrastructure Layer

- Keep resolvers thin and focused on orchestration only
- Place resolvers in `infrastructure/controllers/` directory
- Inject use cases through dependency injection, not direct service calls
- Never include business logic directly in resolvers
- Use proper typing with generated GraphQL types

```typescript
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
  ) {}

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string): Promise<UserResponse | null> {
    try {
      const user = await this.findUserUseCase.execute({ id });
      return user;
    } catch (error) {
      if (error instanceof UserNotFoundDomainException) {
        return null;
      }
      throw new GraphQLError('Failed to fetch user', {
        extensions: { code: 'USER_FETCH_ERROR' },
      });
    }
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: UserCreateInput): Promise<UserResponse> {
    const result = await this.createUserUseCase.execute(input);
    return result;
  }
}
```

### Field Resolvers for Complex Properties

- Use field resolvers for computed properties and relations
- Implement proper data loading strategies to avoid N+1 queries
- Keep field resolvers focused on single responsibility
- Use DataLoader pattern for batching related queries

```typescript
@ResolveField(() => [Post])
async posts(@Parent() user: User): Promise<PostResponse[]> {
  return this.findUserPostsUseCase.execute({ userId: user.id });
}

@ResolveField(() => Int)
async postCount(@Parent() user: User): Promise<number> {
  return this.countUserPostsUseCase.execute({ userId: user.id });
}
```

## 3. DataLoader Pattern for N+1 Query Prevention

### DataLoader Implementation

- Implement DataLoader for batching database queries
- Create DataLoader instances in request scope to ensure proper caching
- Use DataLoader for all relational data fetching
- Key DataLoaders by entity ID for optimal batching

```typescript
@Injectable({ scope: Scope.REQUEST })
export class UserDataLoader {
  constructor(private readonly userRepository: UserRepository) {}

  private readonly batchUsers = new DataLoader<string, UserEntity | null>(
    async (userIds: readonly string[]) => {
      const users = await this.userRepository.findByIds([...userIds]);
      const userMap = new Map(users.map(user => [user.id, user]));
      return userIds.map(id => userMap.get(id) || null);
    },
  );

  async load(id: string): Promise<UserEntity | null> {
    return this.batchUsers.load(id);
  }

  async loadMany(ids: string[]): Promise<(UserEntity | null)[]> {
    return this.batchUsers.loadMany(ids);
  }
}
```

### Integration with Resolvers

- Inject DataLoader in field resolvers
- Use DataLoader for all relational field resolution
- Clear DataLoader cache when entities are modified
- Monitor DataLoader effectiveness with proper logging

```typescript
@ResolveField(() => User)
async author(
  @Parent() post: Post,
  @Context('userLoader') userLoader: UserDataLoader
): Promise<UserEntity | null> {
  return userLoader.load(post.authorId);
}
```

## 4. Authentication and Authorization

### Authentication with Guards

- Use NestJS guards for authentication at resolver level
- Implement JWT token validation in GraphQL context
- Extract user information from token and add to context
- Handle authentication errors with proper GraphQL errors

```typescript
@Injectable()
export class GraphQLAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest<User>(err: any, user: User): User {
    if (err || !user) {
      throw new GraphQLError('Authentication required', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }
    return user;
  }
}

// Apply to resolvers
@UseGuards(GraphQLAuthGuard)
@Mutation(() => User)
async updateProfile(@Args('input') input: UpdateProfileInput): Promise<User> {
  // Implementation
}
```

### Role-Based Authorization

- Implement custom authorization decorators
- Check permissions at field and operation level
- Use context to access current user information
- Implement resource-based authorization when needed

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) return true;

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    return roles.includes(user.role);
  }
}

// Usage
@Roles(UserRole.ADMIN)
@UseGuards(GraphQLAuthGuard, RolesGuard)
@Mutation(() => Boolean)
async deleteUser(@Args('id') id: string): Promise<boolean> {
  // Implementation
}
```

## 5. GraphQL Error Handling

### Domain Error Mapping

- Map domain exceptions to appropriate GraphQL errors
- Use GraphQLError with proper extensions for client consumption
- Implement consistent error codes across the API
- Never leak infrastructure errors to GraphQL responses

```typescript
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): GraphQLError {
    if (exception instanceof UserNotFoundDomainException) {
      return new GraphQLError('User not found', {
        extensions: {
          code: 'USER_NOT_FOUND',
          field: 'user',
        },
      });
    }

    if (exception instanceof ValidationDomainException) {
      return new GraphQLError('Validation failed', {
        extensions: {
          code: 'VALIDATION_ERROR',
          validationErrors: exception.errors,
        },
      });
    }

    // Fallback for unexpected errors
    return new GraphQLError('Internal server error', {
      extensions: { code: 'INTERNAL_ERROR' },
    });
  }
}
```

### Input Validation Errors

- Use class-validator with DTOs for input validation
- Transform validation errors to GraphQL format
- Provide field-level error details for better UX
- Use proper error extensions for client handling

```typescript
@InputType()
export class UserCreateInput {
  @Field()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsString({ message: 'Name must be a string' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  name: string;
}

// Error transformation
private transformValidationErrors(errors: ValidationError[]): GraphQLFormattedError {
  return new GraphQLError('Input validation failed', {
    extensions: {
      code: 'VALIDATION_ERROR',
      fields: errors.reduce((acc, error) => {
        acc[error.property] = Object.values(error.constraints || {});
        return acc;
      }, {} as Record<string, string[]>)
    }
  });
}
```

## 6. Mercurius Subscriptions

### PubSub Configuration

- Configure Mercurius with proper PubSub implementation
- Use Redis for production environments for horizontal scaling
- Implement proper subscription authentication and authorization
- Handle subscription lifecycle properly

```typescript
@Module({
  imports: [
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      useFactory: () => ({
        typePaths: ['./**/*.graphql'],
        subscription: {
          pubsub: MercuriusPubSub(), // Use Redis in production
        },
        context: (request, reply) => ({
          req: request,
          reply,
        }),
      }),
    }),
  ],
})
export class GraphQLConfigModule {}
```

### Subscription Implementation

- Use @Subscription decorator for subscription resolvers
- Implement proper filtering to reduce unnecessary data transmission
- Handle subscription cleanup on client disconnect
- Use proper typing for subscription payloads

```typescript
@Resolver(() => Post)
export class PostSubscriptionResolver {
  constructor(private readonly pubSub: PubSubEngine) {}

  @Subscription(() => Post, {
    filter: (payload, variables, context) => {
      // Only send to authenticated users
      if (!context.req.user) return false;

      // Filter by user preferences or permissions
      return payload.newPost.authorId === variables.authorId;
    },
  })
  newPost(@Args('authorId', { nullable: true }) authorId?: string) {
    return this.pubSub.asyncIterator('POST_CREATED');
  }

  @Mutation(() => Post)
  async createPost(@Args('input') input: PostCreateInput): Promise<Post> {
    const post = await this.createPostUseCase.execute(input);

    // Publish to subscribers
    await this.pubSub.publish('POST_CREATED', { newPost: post });

    return post;
  }
}
```

### Connection Management

- Implement proper WebSocket connection handling
- Use connection params for authentication
- Handle connection timeouts and reconnections
- Monitor subscription performance and resource usage

## 7. Testing GraphQL Resolvers

### Unit Testing Resolvers

- Test resolver logic in isolation by mocking use cases
- Use proper TypeScript typing for test setup
- Test both success and error scenarios
- Mock external dependencies and focus on resolver behavior

```typescript
describe('UserResolver', () => {
  let resolver: UserResolver;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let findUserUseCase: jest.Mocked<FindUserUseCase>;

  beforeEach(async () => {
    const mockCreateUserUseCase = {
      execute: jest.fn(),
    };
    const mockFindUserUseCase = {
      execute: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: FindUserUseCase, useValue: mockFindUserUseCase },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    createUserUseCase = module.get(CreateUserUseCase);
    findUserUseCase = module.get(FindUserUseCase);
  });

  it('should return user when found', async () => {
    const expectedUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    findUserUseCase.execute.mockResolvedValue(expectedUser);

    const result = await resolver.user('1');

    expect(result).toEqual(expectedUser);
    expect(findUserUseCase.execute).toHaveBeenCalledWith({ id: '1' });
  });
});
```

### Integration Testing with TestingModule

- Test complete GraphQL operations end-to-end
- Use real database connections with test data
- Test authentication and authorization flows
- Validate response structure and error handling

```typescript
describe('GraphQL Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(testPrismaInstance)
      .compile();

    app = module.createNestApplication();
    prisma = module.get<PrismaService>(PrismaService);
    await app.init();
  });

  it('should create user via GraphQL mutation', async () => {
    const mutation = `
      mutation CreateUser($input: UserCreateInput!) {
        createUser(input: $input) {
          id
          email
          name
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation,
        variables: {
          input: { email: 'test@example.com', name: 'Test User' },
        },
      })
      .expect(200);

    expect(response.body.data.createUser).toMatchObject({
      email: 'test@example.com',
      name: 'Test User',
    });
  });
});
```

## 8. Performance Optimization

### Query Complexity Analysis

- Implement query complexity analysis to prevent expensive operations
- Set reasonable complexity limits based on your infrastructure
- Monitor query performance and adjust limits accordingly
- Use query depth limiting for nested queries

```typescript
@Module({
  imports: [
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      useFactory: () => ({
        queryDepth: 10, // Limit query depth
        validationRules: [require('graphql-query-complexity').createComplexityLimitRule(1000)],
        plugins: [
          {
            app: {
              // Add query complexity analysis
              addHook: 'preValidation',
              handler: async function (request, reply) {
                // Analyze query complexity
              },
            },
          },
        ],
      }),
    }),
  ],
})
export class GraphQLModule {}
```

### Caching Strategies

- Implement field-level caching for expensive computations
- Use Redis for distributed caching in production
- Cache at the use case level, not resolver level
- Implement cache invalidation strategies

```typescript
@Injectable()
export class CachedUserStatsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(userId: string): Promise<UserStats> {
    const cacheKey = `user_stats:${userId}`;

    let stats = await this.cacheService.get<UserStats>(cacheKey);
    if (stats) return stats;

    stats = await this.calculateUserStats(userId);
    await this.cacheService.set(cacheKey, stats, 300); // 5 min TTL

    return stats;
  }
}
```

### Pagination Implementation

- Use cursor-based pagination for scalable data fetching
- Implement proper connection types following Relay specification
- Provide totalCount only when necessary (expensive operation)
- Use proper typing for pagination arguments and responses

```typescript
@ObjectType()
export class UserConnection {
  @Field(() => [UserEdge])
  edges: UserEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int, { nullable: true })
  totalCount?: number;
}

@Query(() => UserConnection)
async users(
  @Args() args: ConnectionArgs,
  @Args('includeCount', { type: () => Boolean, defaultValue: false }) includeCount: boolean
): Promise<UserConnection> {
  return this.findUsersUseCase.execute({
    ...args,
    includeCount
  });
}
```

## 9. Code Organization and Architecture

### Hexagonal Architecture Integration

- Place GraphQL resolvers in `infrastructure/controllers/` directory
- Keep resolvers focused on orchestration, delegate to use cases
- Use dependency injection to wire resolvers with use cases
- Never include business logic directly in resolvers
- Follow naming convention: `EntityResolver` (e.g., `UserResolver`)

### Module Structure for GraphQL

```
src/modules/user/
├── infrastructure/
│   └── controllers/
│       ├── user.resolver.ts          # GraphQL resolver
│       └── user-subscription.resolver.ts # Subscription resolver
├── application/
│   ├── dto/
│   │   ├── user-create.input.ts      # GraphQL input types
│   │   ├── user-update.input.ts      # GraphQL input types
│   │   └── user.response.ts          # GraphQL response types
│   └── use-cases/
│       ├── create-user.use-case.ts   # Business logic
│       └── find-user.use-case.ts     # Business logic
```

### Type Safety with GraphQL

- Generate TypeScript types from GraphQL schema
- Use proper typing for resolver arguments and return types
- Implement proper validation with class-validator on input types
- Use GraphQL scalar types for custom data types (DateTime, Email, etc.)

```typescript
// Custom scalar for DateTime
@Scalar('DateTime')
export class DateTimeScalar implements CustomScalar<string, Date> {
  description = 'DateTime custom scalar type';

  parseValue(value: string): Date {
    return new Date(value); // from client
  }

  serialize(value: Date): string {
    return value.toISOString(); // to client
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new GraphQLError('Can only parse strings to DateTime');
  }
}
```

## 10. Development Workflow and Tools

### Schema-First vs Code-First Approach

- Use Code-First approach with decorators for better TypeScript integration
- Generate schema automatically from TypeScript classes
- Keep schema generation in build pipeline
- Version control generated schema for review purposes

### GraphQL Tooling Integration

- Use GraphQL Playground or GraphiQL for development testing
- Implement proper introspection (disable in production)
- Use proper logging for GraphQL operations and performance
- Monitor resolver performance with timing extensions

```typescript
// Add timing information to responses
@Module({
  imports: [
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      useFactory: () => ({
        playground: process.env.NODE_ENV !== 'production',
        introspection: process.env.NODE_ENV !== 'production',
        plugins: [
          // Add query timing
          {
            requestDidStart() {
              return {
                willSendResponse(requestContext) {
                  const duration = Date.now() - requestContext.request.http.headers['x-start-time'];
                  requestContext.response.http.headers['x-response-time'] = duration;
                },
              };
            },
          },
        ],
      }),
    }),
  ],
})
export class GraphQLConfigModule {}
```

### Error Monitoring and Logging

- Log all GraphQL operations with proper context (user, query, variables)
- Implement error tracking for production debugging
- Monitor query complexity and performance metrics
- Use structured logging with correlation IDs

```typescript
@Injectable()
export class GraphQLLoggingPlugin implements Plugin {
  constructor(private readonly logger: Logger) {}

  requestDidStart(): GraphQLRequestListener {
    return {
      didResolveOperation(requestContext) {
        this.logger.log({
          operation: requestContext.request.operationName,
          query: requestContext.request.query,
          variables: requestContext.request.variables,
          user: requestContext.context.user?.id,
        });
      },
      didEncounterErrors(requestContext) {
        requestContext.errors.forEach(error => {
          this.logger.error({
            error: error.message,
            stack: error.stack,
            operation: requestContext.request.operationName,
          });
        });
      },
    };
  }
}
```

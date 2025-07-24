# NestJS Template - Copilot Instructions

## Language Guidelines

**Always respond in Spanish** when communicating with developers, but keep all code, comments, documentation, and technical content in English. This ensures consistency with international development standards while providing explanations in Spanish.

## Architecture Overview

This is a **NestJS TypeScript template** using **Fastify** as the HTTP adapter instead of Express. The codebase follows NestJS conventions with a centralized configuration system and strict code quality standards.

### Key Components

- **Platform**: Fastify adapter (`@nestjs/platform-fastify`) for better performance
- **Configuration**: Centralized config using `@nestjs/config` with typed configuration objects
- **Application Bootstrap**: Custom bootstrap process in `src/main.ts` with structured logging

## Configuration Pattern

Configuration is managed through typed configuration objects in `src/config/`:

```typescript
// Follow this pattern for new config modules
export type MyConfig = {
  property: string;
};

export default registerAs('myConfig', (): MyConfig => ({
  property: process.env.MY_PROPERTY || 'default',
}));
```

Register new configs in `AppModule.imports` ConfigModule.forRoot({ load: [...] }).

## Barrel Export Pattern

Use `index.ts` files to create clean import paths and centralize exports:

```typescript
// src/config/index.ts - Example barrel export
export { default as appConfig, AppConfig } from './appConfig';
export { default as dbConfig, DbConfig } from './dbConfig';
```

This allows imports like `import { appConfig, AppConfig } from './config'` instead of relative paths.

## Development Workflow

### Essential Commands
- `pnpm start:dev` - Development with hot reload
- `pnpm test:watch` - Unit tests in watch mode  
- `pnpm test:e2e` - End-to-end tests
- `pnpm lint` - ESLint with auto-fix
- `pnpm format` - Prettier formatting

### Code Quality Standards
- **Commit Convention**: Enforced via commitlint with custom scope rules (required scope, multiple case formats allowed)
- **ESLint Config**: Flat config format with TypeScript strict rules, some relaxed (@typescript-eslint/no-explicit-any: off)
- **Testing**: Jest for unit tests, separate e2e configuration in `test/jest-e2e.json`

## Project Conventions

### File Structure
- Controllers and services at module root level
- Configuration modules in `src/config/` with typed exports
- Tests co-located with source files (`.spec.ts`)
- E2E tests in separate `test/` directory
- **Barrel Exports**: Use `index.ts` files for clean imports (see `src/config/index.ts`)

### TypeScript Settings
- Target: ES2023, CommonJS modules
- Decorators enabled for NestJS
- Strict null checks enabled, but `noImplicitAny: false` for flexibility

### Environment Configuration
Application config expects these environment variables:
- `APP_PORT` (default: 4200)
- `APP_PREFIX` (default: 'v1') - API path prefix
- `APP_ENV`, `APP_LOG_LEVEL`, `APP_NAME`, etc.

## Integration Points

- **Global Prefix**: Set via configuration, applied to all routes
- **Logging**: Built-in NestJS Logger with configurable levels
- **Config Service**: Inject typed config objects via `ConfigService.get<Type>('configKey')`

## Testing Patterns

Unit tests use NestJS TestingModule pattern:
```typescript
const app: TestingModule = await Test.createTestingModule({
  controllers: [Controller],
  providers: [Service],
}).compile();
```

When adding new modules, include appropriate testing setup and follow the established controller/service testing patterns.

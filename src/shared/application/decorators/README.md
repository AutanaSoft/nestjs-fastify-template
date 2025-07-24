# Application - Decorators

Esta carpeta contiene decorators personalizados que se usan en toda la aplicación.

## Contenido típico:

- **Validation Decorators**: Validaciones personalizadas
- **Authorization Decorators**: Control de acceso (@Roles, @Permissions)
- **Caching Decorators**: Decorators para cache automático
- **Logging Decorators**: Logging automático de métodos
- **Rate Limiting Decorators**: Control de velocidad por método
- **Transaction Decorators**: Manejo de transacciones
- **Retry Decorators**: Reintentos automáticos

## Ejemplo de estructura:
```
decorators/
  validation/
    is-email.decorator.ts
    is-strong-password.decorator.ts
  auth/
    roles.decorator.ts
    permissions.decorator.ts
  cache/
    cacheable.decorator.ts
  logging/
    log-execution.decorator.ts
  performance/
    rate-limit.decorator.ts
    retry.decorator.ts
  index.ts
```

## Ejemplo de contenido:
```typescript
// roles.decorator.ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// cacheable.decorator.ts
export const Cacheable = (ttl: number) => 
  SetMetadata('cache', { ttl });
```

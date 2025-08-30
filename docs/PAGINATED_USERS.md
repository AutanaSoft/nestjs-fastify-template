# Método findAllPaginated - Documentación

## Descripción

El método `findAllPaginated` ha sido implementado en el repositorio de usuarios para permitir consultas paginadas con filtrado y ordenamiento. Esta implementación sigue los principios de Clean Architecture y está integrada con GraphQL.

## Características Implementadas

### 1. Repositorio (Domain Layer)

- **Archivo**: `src/modules/user/domain/repositories/user.repository.ts`
- **Método**: `findAllPaginated(params: UserFindAllPaginateData): Promise<PaginatedResult<UserEntity>>`

### 2. Adaptador Prisma (Infrastructure Layer)

- **Archivo**: `src/modules/user/infrastructure/adapters/user-prisma.adapter.ts`
- **Características**:
  - Ejecuta consultas paralelas para datos y conteo total (mejor performance)
  - Soporte para filtrado por email, username, status, role y fechas
  - Búsqueda case-insensitive para campos de texto
  - Ordenamiento configurable con fallback a createdAt desc
  - Cálculo automático de metadatos de paginación

### 3. Caso de Uso (Application Layer)

- **Archivo**: `src/modules/user/application/use-cases/find-users-paginated.use-case.ts`
- **Funcionalidad**:
  - Orquesta la consulta paginada
  - Transforma entidades de dominio a DTOs
  - Logging detallado de operaciones
  - Manejo de valores por defecto para paginación

### 4. DTOs y Validación

- **Input DTOs**:
  - `UserPaginationInputDto`: Parámetros de paginación con validación
  - `UserFindPaginatedArgsDto`: Argumentos completos para GraphQL
- **Response DTOs**:
  - `UserPaginatedResponseDto`: Respuesta paginada con metadatos

### 5. Resolver GraphQL (Infrastructure Layer)

- **Archivo**: `src/modules/user/infrastructure/resolvers/user.resolver.ts`
- **Query**: `findUsersPaginated`

## Ejemplo de Uso GraphQL

```graphql
query FindUsersPaginated {
  findUsersPaginated(
    pagination: { page: 1, limit: 10 }
    filter: { status: ACTIVE, role: USER }
    sort: { sortBy: CREATED_AT, sortOrder: DESC }
  ) {
    data {
      id
      email
      userName
      status
      role
      createdAt
      updatedAt
    }
    paginationInfo {
      totalDocs
      start
      end
      totalPages
      page
      next
      previous
    }
  }
}
```

## Tipos de Respuesta

### PaginatedResult<UserEntity>

```typescript
interface PaginatedResult<T> {
  readonly data: T[];
  readonly paginationInfo: {
    readonly totalDocs: number;
    readonly start: number;
    readonly end: number;
    readonly totalPages: number;
    readonly page: number;
    readonly next?: number | null;
    readonly previous?: number | null;
  };
}
```

## Parámetros de Entrada

### UserFindAllPaginateData

```typescript
type UserFindAllPaginateData = {
  page: number; // Página actual (1-based)
  limit: number; // Items por página (1-100)
  filter?: {
    // Filtros opcionales
    email?: string;
    userName?: string;
    status?: UserStatus;
    role?: UserRole;
    createdAtFrom?: Date;
    createdAtTo?: Date;
  };
  sort?: {
    // Ordenamiento opcional
    sortBy?: UserSortBy;
    sortOrder?: SortOrder;
  };
};
```

## Límites de Paginación

- **Mínimo**: 1 item por página
- **Máximo**: 100 items por página
- **Por defecto**: 10 items por página

## Performance

- Las consultas de datos y conteo se ejecutan en paralelo usando `Promise.all()`
- Índices de base de datos recomendados en campos de filtrado frecuentes
- Paginación eficiente usando `skip` y `take` de Prisma

## Validación

- Validación automática de parámetros de entrada
- Tipos seguros en toda la cadena (TypeScript + GraphQL)
- Límites configurables para prevenir sobrecarga del servidor

## Integración con Arquitectura Existente

- Mantiene los patrones establecidos del proyecto
- Compatible con el sistema de logging Pino
- Integrado con el manejo de errores existente
- Siguie las convenciones de GraphQL del proyecto

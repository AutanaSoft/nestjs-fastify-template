# PrismaErrorHandlerService

El `PrismaErrorHandlerService` es un servicio compartido ubicado en la capa de infraestructura que proporciona un manejo centralizado y configurable de errores de Prisma ORM. Este servicio resuelve el problema de duplicación de lógica de manejo de errores entre diferentes módulos que usan Prisma.

## Ubicación

```
src/shared/infrastructure/services/prisma-error-handler.service.ts
```

## Problema Resuelto

Anteriormente, cada adapter de Prisma tenía su propio método `processError` con lógica duplicada y mensajes hardcodeados específicos del módulo. Esto creaba:

- **Duplicación de código**: La misma lógica de mapeo de errores se repetía
- **Mantenimiento difícil**: Cambios en el manejo de errores requerían actualizaciones en múltiples archivos
- **Inconsistencias**: Diferentes módulos podían manejar los mismos errores de manera diferente
- **Falta de flexibilidad**: Mensajes de error hardcodeados sin posibilidad de customización

## Solución Implementada

### Características Principales

1. **Centralización**: Un único servicio maneja todos los errores de Prisma
2. **Configurabilidad**: Permite personalizar mensajes y códigos por módulo
3. **Extensibilidad**: Fácil agregar nuevos tipos de errores
4. **Consistencia**: Mapeo uniforme de errores Prisma a errores de dominio
5. **Logging Contextual**: Mantiene el contexto del módulo que llama

### Tipos de Errores Manejados

- `PrismaClientKnownRequestError` (códigos P2xxx)
  - `P2002`: Violación de constraint único → `ConflictError`
  - `P2025`: Registro no encontrado → `NotFoundError`
  - `P2003`: Violación de foreign key → `ConflictError`
- `PrismaClientValidationError` → `DatabaseError`
- `PrismaClientInitializationError` → `DatabaseError`
- Errores desconocidos → `DatabaseError`

## Configuración

### Interface PrismaErrorConfig

```typescript
interface PrismaErrorConfig {
  /** Identificador de contexto para logging */
  context: string;

  /** Mensajes personalizados para códigos de error específicos */
  messages?: {
    uniqueConstraint?: string;
    notFound?: string;
    foreignKeyConstraint?: string;
    validation?: string;
    connection?: string;
    unknown?: string;
  };

  /** Códigos de error personalizados para extensiones GraphQL */
  codes?: {
    notFound?: string;
  };
}
```

## Uso en Adapters

### 1. Inyección del Servicio

```typescript
@Injectable()
export class YourModulePrismaAdapter extends YourModuleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaErrorHandler: PrismaErrorHandlerService,
    @InjectPinoLogger(YourModulePrismaAdapter.name)
    private readonly logger: PinoLogger,
  ) {
    super();
  }
}
```

### 2. Manejo de Errores en Métodos

```typescript
async create(data: YourModuleCreateData): Promise<YourModuleEntity> {
  try {
    const created = await this.prisma.yourModule.create({ data });
    return plainToInstance(YourModuleEntity, created);
  } catch (error) {
    this.prismaErrorHandler.handleError(
      error,
      {
        context: YourModulePrismaAdapter.name,
        messages: {
          uniqueConstraint: 'Resource with this identifier already exists',
          notFound: 'Resource not found',
          validation: 'Invalid resource data provided',
        },
        codes: {
          notFound: 'YOUR_MODULE_NOT_FOUND',
        },
      },
      this.logger,
    );
  }
}
```

## Ejemplos por Módulo

### User Module (Actual)

```typescript
messages: {
  uniqueConstraint: 'User with this email or username already exists',
  notFound: 'User not found',
  foreignKeyConstraint: 'Invalid reference in user data',
}
```

### Post Module (Ejemplo)

```typescript
messages: {
  uniqueConstraint: 'Post with this slug already exists',
  notFound: 'Post not found',
  foreignKeyConstraint: 'Invalid author or category reference',
}
```

### Category Module (Ejemplo)

```typescript
messages: {
  uniqueConstraint: 'Category with this name already exists',
  notFound: 'Category not found',
  foreignKeyConstraint: 'Invalid parent category reference',
}
```

## Ventajas de la Implementación

### ✅ Reutilización

- Un solo servicio para todos los módulos
- Lógica centralizada de mapeo de errores

### ✅ Configurabilidad

- Mensajes personalizables por módulo
- Códigos de error específicos del contexto

### ✅ Mantenibilidad

- Cambios en una sola ubicación
- Testing centralizado

### ✅ Consistencia

- Manejo uniforme de errores
- Estructura de logging consistente

### ✅ Extensibilidad

- Fácil agregar nuevos códigos de error Prisma
- Posibilidad de agregar nuevos tipos de configuración

## Refactorización Realizada

### Antes (UserPrismaAdapter)

```typescript
// Método privado con lógica hardcodeada
private processError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const message = 'User with this email or username already exists';
      // ... resto de la lógica hardcodeada
    }
  }
  // ... más lógica duplicada
}
```

### Después (Servicio Compartido)

```typescript
// Servicio reutilizable y configurable
this.prismaErrorHandler.handleError(
  error,
  {
    context: UserPrismaAdapter.name,
    messages: {
      uniqueConstraint: 'User with this email or username already exists',
      // ... configuración específica del módulo
    },
  },
  this.logger,
);
```

## Consideraciones de Implementación

1. **Registro en SharedModule**: El servicio está registrado en `SharedModule` y exportado para uso en otros módulos
2. **Logging Contextual**: Cada llamada incluye el contexto del adapter que lo invoca
3. **Tipo de Retorno Never**: El método `handleError` siempre lanza una excepción, nunca retorna
4. **Configuración Opcional**: Todos los campos de configuración son opcionales, con defaults sensatos

Este refactoring mejora significativamente la arquitectura del proyecto al centralizar el manejo de errores de Prisma mientras mantiene la flexibilidad necesaria para cada módulo específico.

# Domain - Entities

Esta carpeta contiene entidades base y abstractas que se reutilizan en toda la aplicación.

## Contenido típico:

- **Base Entity**: Entidad base con propiedades comunes (id, createdAt, updatedAt)
- **Aggregate Root**: Clase base para aggregate roots
- **Domain Entity**: Entidad base con reglas de dominio
- **Auditable Entity**: Entidad con campos de auditoría
- **Soft Delete Entity**: Entidad con borrado lógico
- **Versioned Entity**: Entidad con versionado

## Ejemplo de estructura:
```
entities/
  base.entity.ts
  aggregate-root.entity.ts
  domain.entity.ts
  auditable.entity.ts
  soft-delete.entity.ts
  versioned.entity.ts
  index.ts
```

## Ejemplo de contenido:
```typescript
// base.entity.ts
export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

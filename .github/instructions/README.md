# Project Instructions Documentation

Este directorio contiene las instrucciones de desarrollo para GitHub Copilot y otros agentes de IA.

## Estructura de Archivos

### `agent-behavior.instructions.md`

- **Propósito**: Comportamiento del agente GitHub Copilot
- **Contenido**: Modo de trabajo (análisis vs implementación), directrices de idioma, stack tecnológico básico, contexto del proyecto
- **Aplicación**: Específico para el comportamiento del agente

### `code-quality.instructions.md`

- **Propósito**: Estándares generales de calidad de código
- **Contenido**: Convenciones de nomenclatura básicas, organización de archivos, calidad de código
- **Aplicación**: `applyTo: '**'` - Todos los archivos del proyecto

### `architecture.instructions.md`

- **Propósito**: Arquitectura hexagonal y estructura de módulos NestJS
- **Contenido**: Estructura de proyecto, capas de arquitectura, inyección de dependencias, sistema de configuración
- **Aplicación**: `applyTo: '**'` - Todos los archivos del proyecto

### `typescript-standards.instructions.md`

- **Propósito**: Mejores prácticas específicas de TypeScript
- **Contenido**: Type safety, convenciones específicas de TS, generics, error handling
- **Aplicación**: `applyTo: '**/*.ts'` - Solo archivos TypeScript

### `graphql-standards.instructions.md`

- **Propósito**: Mejores prácticas de GraphQL con Mercurius
- **Contenido**: Schema design, resolvers, performance, subscriptions
- **Aplicación**: `applyTo: '**/*.ts'` - Solo archivos TypeScript

### `database-standards.instructions.md`

- **Propósito**: Mejores prácticas específicas de Prisma y base de datos
- **Contenido**: Schema design, operaciones de base de datos, migraciones, performance
- **Aplicación**: `applyTo: '**/*.ts'` - Solo archivos TypeScript

### `security-standards.instructions.md`

- **Propósito**: Mejores prácticas de seguridad
- **Contenido**: Autenticación, autorización, protección de datos, validación
- **Aplicación**: `applyTo: '**/*.ts'` - Solo archivos TypeScript

### `testing-standards.instructions.md`

- **Propósito**: Mejores prácticas de testing
- **Contenido**: Unit testing, integration testing, E2E testing, herramientas
- **Aplicación**: `applyTo: '**/*.ts'` - Solo archivos TypeScript

### `error-handling-standards.instructions.md`

- **Propósito**: Mejores prácticas de manejo de errores
- **Contenido**: Domain errors, infrastructure errors, GraphQL errors, logging
- **Aplicación**: `applyTo: '**/*.ts'` - Solo archivos TypeScript

## Orden de Aplicación

Los archivos se aplican en el siguiente orden de especialización:

1. **`code-quality.instructions.md`** - Fundamentos generales
2. **`typescript-standards.instructions.md`** - Específico del lenguaje
3. **`architecture.instructions.md`** - Específico del framework y arquitectura
4. **Archivos especializados** - GraphQL, Database, Security, Testing, Error Handling
5. **`agent-behavior.instructions.md`** - Comportamiento del agente

## Principios de Organización

- **Sin duplicación**: Cada instrucción debe estar en un solo archivo
- **Especialización**: Cada archivo cubre un dominio específico
- **Referencias cruzadas**: Los archivos pueden referenciar otros para evitar duplicación
- **Jerarquía clara**: Desde general a específico
- **Aplicación selectiva**: Uso del campo `applyTo` para controlar alcance

## Mantenimiento

- Revisar regularmente para evitar duplicaciones
- Mantener consistencia entre archivos
- Actualizar referencias cuando se modifique estructura
- Documentar cambios significativos en el historial de commits
- **Jerarquía clara**: Desde general a específico
- **Aplicación selectiva**: Uso del campo `applyTo` para controlar alcance

## Mantenimiento

- Revisar regularmente para evitar duplicaciones
- Mantener consistencia entre archivos
- Actualizar referencias cuando se modifique estructura
- Documentar cambios significativos en el historial de commits

# User Module Refactoring - API Examples

Este documento muestra ejemplos de uso de los endpoints refactorizados del módulo de usuario.

## Endpoints Disponibles

### 1. Crear Usuario (POST /users)

```json
{
  "email": "usuario@ejemplo.com",
  "password": "StrongP@ss1",
  "userName": "usuario_123"
}
```

#### Validaciones:

- **email**: Máximo 50 caracteres, formato email válido
- **password**: 6-16 caracteres, debe contener al menos:
  - 1 letra mayúscula
  - 1 número
  - 1 carácter especial (@#$.-\_)
- **userName**: 3-20 caracteres, solo alfanumérico y símbolos . - \_

#### Respuesta exitosa (201):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "userName": "usuario_123",
  "status": "REGISTERED",
  "role": "USER",
  "createdAt": "2025-07-31T10:00:00Z",
  "updatedAt": "2025-07-31T10:00:00Z"
}
```

### 2. Buscar Usuario por Email (GET /users/by-email?email=usuario@ejemplo.com)

#### Respuesta exitosa (200):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "userName": "usuario_123",
  "status": "REGISTERED",
  "role": "USER",
  "createdAt": "2025-07-31T10:00:00Z",
  "updatedAt": "2025-07-31T10:00:00Z"
}
```

#### Respuesta usuario no encontrado (404):

```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

### 3. Actualizar Usuario (PATCH /users/:id)

```json
{
  "status": "ACTIVE",
  "role": "ADMIN"
}
```

#### Campos actualizables:

- **status**: REGISTERED, ACTIVE, BANNED, INACTIVE
- **role**: ADMIN, USER

#### Respuesta exitosa (200):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "userName": "usuario_123",
  "status": "ACTIVE",
  "role": "ADMIN",
  "createdAt": "2025-07-31T10:00:00Z",
  "updatedAt": "2025-07-31T10:00:00Z"
}
```

## Cambios Principales Implementados

### 1. Nuevos campos en el modelo User:

- `userName`: Nombre de usuario único (3-20 caracteres)
- `role`: Rol del usuario (ADMIN, USER)

### 2. Validaciones implementadas:

- Email único y formato válido
- UserName único con caracteres permitidos
- Password con complejidad específica
- Hash seguro de contraseñas con bcrypt

### 3. Endpoints refactorizados:

- Creación de usuario con validaciones
- Búsqueda por email en lugar de ID
- Actualización solo de role y status

### 4. Arquitectura mantenida:

- Patrón de arquitectura hexagonal
- Casos de uso separados
- DTOs con validaciones
- Repositorio con adapter de Prisma
- Respuestas consistentes sin password

## Swagger Documentation

Para ver la documentación completa e interactiva de la API, visita:
http://localhost:4200/docs

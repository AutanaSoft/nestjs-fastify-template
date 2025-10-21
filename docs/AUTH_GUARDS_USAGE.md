# Auth Guards y Decoradores - Guía de Uso

## 🔐 Sistema de Autenticación Implementado

Este documento explica cómo usar los guards y decoradores de autenticación que se han implementado siguiendo las recomendaciones de NestJS y Passport.

## 📦 Componentes Disponibles

### Guards

- `JwtAuthGuard` - Para proteger rutas HTTP
- `GqlJwtAuthGuard` - Para proteger resolvers GraphQL

### Decoradores

- `@CurrentUser()` - Para obtener el usuario autenticado

## 🚀 Ejemplos de Uso

### HTTP Controllers

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser } from '@/modules/auth';
import { UserEntity } from '@/modules/user/domain/entities';

@Controller('profile')
export class ProfileController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@CurrentUser() user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      userName: user.userName,
    };
  }
}
```

### GraphQL Resolvers

```typescript
import { Query, Resolver, UseGuards } from '@nestjs/graphql';
import { GqlJwtAuthGuard, CurrentUser } from '@/modules/auth';
import { UserEntity } from '@/modules/user/domain/entities';
import { UserDto } from '@/modules/user/application/dto';

@Resolver(() => UserDto)
export class ProfileResolver {
  @UseGuards(GqlJwtAuthGuard)
  @Query(() => UserDto)
  currentUser(@CurrentUser() user: UserEntity): UserDto {
    return new UserDto(user);
  }
}
```

## 🔧 Configuración de Headers

Para usar los guards, las requests deben incluir el JWT token en el header Authorization:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🏗️ Arquitectura

El sistema implementado:

1. **JwtStrategy** - Valida tokens JWT usando el servicio existente
2. **Guards** - Protegen rutas automáticamente
3. **Decoradores** - Extraen información del usuario autenticado
4. **Integración** - Se conecta con tu sistema JWT existente

## ⚡ Ventajas

- ✅ **Compatible** con tu arquitectura hexagonal existente
- ✅ **Reutiliza** tu JwtTokenService actual
- ✅ **Funciona** con HTTP y GraphQL
- ✅ **Sigue** las mejores prácticas de NestJS
- ✅ **Type-safe** con TypeScript completo

## 🎯 Próximos Pasos

1. Implementar login/logout endpoints
2. Agregar guards opcionales (para rutas públicas)
3. Implementar autorización por roles
4. Agregar refresh token endpoints

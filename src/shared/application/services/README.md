# JWT Token Service

Este servicio JWT ha sido extraído del módulo de autenticación para ser reutilizable a través de toda la aplicación.

## Descripción

El `JwtTokenService` proporciona funcionalidades JWT genéricas que pueden ser utilizadas por diferentes módulos que necesiten generar o validar tokens JWT.

## Características

- Generación de access tokens
- Generación de tokens temporales para acciones específicas
- Validación de access tokens y tokens temporales
- Manejo de errores con excepciones de dominio apropiadas
- Logging comprehensivo de todas las operaciones

## Uso en Módulos

### Módulo de Autenticación

El módulo de autenticación usa este servicio para las operaciones JWT y se enfoca en la lógica específica del repositorio de tokens (persistencia, refresh tokens, etc.)

```typescript
// En JwtTokenAdapter
export class JwtTokenAdapter implements TokenRepository {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    // ...
  ) {}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtTokenService.generateAccessToken(payload);
  }
}
```

### Módulo de Usuario (ejemplo)

El módulo de usuario podría usar este servicio para tokens de verificación:

```typescript
// En UserVerificationService
@Injectable()
export class UserVerificationService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    // ...
  ) {}

  async generateEmailVerificationToken(user: UserEntity): Promise<string> {
    return this.jwtTokenService.generateTempToken(user, JwtTempTokenType.EMAIL_VERIFICATION);
  }

  async validateEmailVerificationToken(token: string): Promise<TempTokenPayload> {
    return this.jwtTokenService.validateTempToken(token, JwtTempTokenType.EMAIL_VERIFICATION);
  }
}
```

### Otros Módulos

Cualquier módulo que necesite funcionalidades JWT puede inyectar este servicio:

```typescript
@Injectable()
export class SomeOtherService {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async createCustomToken(user: UserEntity): Promise<string> {
    return this.jwtTokenService.generateTempToken(user, JwtTempTokenType.CUSTOM);
  }
}
```

## Configuración

El servicio está automáticamente disponible en toda la aplicación a través del `SharedModule`. No necesita configuración adicional más allá de las variables de entorno JWT existentes.

## Separación de Responsabilidades

### JwtTokenService (Shared)

- Operaciones JWT genéricas
- Generación y validación de tokens
- Funcionalidades reutilizables

### JwtTokenAdapter (Auth Module)

- Lógica específica del repositorio de tokens
- Persistencia de refresh tokens
- Operaciones de negocio específicas de autenticación

### RefreshTokenPrismaAdapter (Auth Module)

- Persistencia de refresh tokens en base de datos
- Operaciones CRUD específicas de refresh tokens

Esta separación permite:

- Mayor reutilización del código JWT
- Mejor testabilidad (servicios más enfocados)
- Mantenimiento más fácil
- Cumplimiento con principios SOLID

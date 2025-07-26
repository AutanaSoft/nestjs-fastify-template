# Throttler Configuration

Esta configuración implementa rate limiting usando `@nestjs/throttler` para proteger la aplicación contra ataques de fuerza bruta y uso excesivo de recursos.

## Variables de Entorno

```bash
# Rate limiting configuration
THROTTLER_TTL=60000          # Time window in milliseconds (default: 60 seconds)
THROTTLER_LIMIT=10           # Max requests per time window (default: 10)
NODE_ENV=test                # Skip throttling in test environment
```

## Uso

### Configuración Global
El throttler está configurado globalmente en el `AppModule` y aplicado a todas las rutas por defecto.

### Decoradores Disponibles

#### `@SkipThrottle()`
Omite el rate limiting para un controlador o método específico:

```typescript
@Get('public-endpoint')
@SkipThrottle()
publicEndpoint() {
  return 'This endpoint has no rate limits';
}
```

#### `@Throttle({ default: { limit: number, ttl: number } })`
Aplica configuración personalizada de rate limiting:

```typescript
@Post('sensitive-action')
@Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
sensitiveAction() {
  return 'This endpoint has stricter limits';
}
```

### Respuestas de Error

Cuando se excede el límite, la API retorna:
- **Status Code:** `429 Too Many Requests`
- **Headers:** Incluye información sobre límites y tiempo restante

## Configuración Personalizada

Para modificar la configuración, actualiza `src/config/throttlerConfig.ts`:

```typescript
export default registerAs(
  'throttlerConfig',
  (): ThrottlerConfig => ({
    ttl: parseInt(process.env.THROTTLER_TTL || '60000', 10),
    limit: parseInt(process.env.THROTTLER_LIMIT || '10', 10),
    skipIf: (context: any) => {
      // Custom skip logic
      return process.env.NODE_ENV === 'test';
    },
  }),
);
```

## Ejemplos de Uso

### Rate Limiting Básico
Todos los endpoints heredan la configuración global (10 requests/minuto por defecto).

### Endpoint Público Sin Límites
```typescript
@Get('health')
@SkipThrottle()
healthCheck() {
  return { status: 'ok' };
}
```

### Endpoint con Límites Estrictos
```typescript
@Post('login')
@Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 attempts per 5 minutes
login(@Body() credentials: LoginDto) {
  return this.authService.login(credentials);
}
```

### Rate Limiting por IP
El throttler usa la IP del cliente por defecto para identificar requests únicos.

## Monitoreo

Para monitorear el uso del throttler, puedes:

1. Revisar los headers de respuesta para información de límites
2. Implementar logging personalizado en el guard
3. Usar métricas de aplicación para trackear requests bloqueados

## Testing

En el entorno de test (`NODE_ENV=test`), el throttling está deshabilitado por defecto para facilitar las pruebas automatizadas.

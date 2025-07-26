# Documentación del Proyecto

Esta carpeta contiene documentación técnica adicional para el proyecto NestJS Template.

## Archivos Disponibles

### Configuración del Sistema

- [APP_CONFIG.md](./APP_CONFIG.md) - Configuración general de la aplicación
- [COOKIE_CONFIG.md](./COOKIE_CONFIG.md) - Configuración de cookies y seguridad
- [CORS_CONFIG.md](./CORS_CONFIG.md) - Configuración de CORS y validación de orígenes
- [THROTTLER_CONFIG.md](./THROTTLER_CONFIG.md) - Configuración de rate limiting y throttling

## Guía de Configuración

### Variables de Entorno por Módulo

| Módulo               | Variables Principales                   | Propósito                           |
| -------------------- | --------------------------------------- | ----------------------------------- |
| **App Config**       | `APP_NAME`, `APP_PORT`, `APP_ENV`       | Configuración general de aplicación |
| **Cookie Config**    | `COOKIE_SECRET`, `COOKIE_SAME_SITE`     | Seguridad de cookies                |
| **CORS Config**      | `CORS_ORIGIN_WHITELIST`, `CORS_METHODS` | Control de acceso cross-origin      |
| **Throttler Config** | `THROTTLER_TTL`, `THROTTLER_LIMIT`      | Límites de rate limiting            |

### Configuración por Entorno

#### Desarrollo

```bash
# Variables mínimas para desarrollo
APP_ENV=development
APP_PORT=4200
CORS_ORIGIN_WHITELIST=
THROTTLER_LIMIT=200
```

#### Producción

```bash
# Variables requeridas para producción
APP_ENV=production
APP_PORT=3000
CORS_ORIGIN_WHITELIST=https://app.yourdomain.com
COOKIE_SECRET=your-secure-secret
THROTTLER_LIMIT=100
```

## Contribuciones

Al agregar nuevas funcionalidades, por favor documenta:

1. **Configuración**: Variables de entorno y opciones
2. **Uso**: Ejemplos prácticos de implementación
3. **API**: Interfaces y decoradores públicos
4. **Testing**: Estrategias de testing específicas

## Convenciones

- Usa Markdown para todos los archivos de documentación
- Incluye ejemplos de código con sintaxis highlighting
- Documenta tanto casos de uso básicos como avanzados
- Mantén la documentación actualizada con los cambios de código

# NestJS Template with Fastify

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  Un template avanzado de <a href="http://nestjs.com/" target="_blank">NestJS</a> con <a href="https://fastify.dev/" target="_blank">Fastify</a>, configuración centralizada y mejores prácticas de desarrollo.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-^20.0.0-green" alt="Node.js Version" />
  <img src="https://img.shields.io/badge/NestJS-^11.0.0-red" alt="NestJS Version" />
  <img src="https://img.shields.io/badge/Fastify-^5.4.0-blue" alt="Fastify Version" />
  <img src="https://img.shields.io/badge/TypeScript-^5.7.3-blue" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/pnpm-^9.0.0-orange" alt="pnpm Version" />
</p>

## ✨ Características Principales

- 🚀 **Fastify**: Adaptador de alto rendimiento en lugar de Express
- ⚙️ **Configuración Centralizada**: Sistema robusto con `@nestjs/config` y variables de entorno
- 🛡️ **Seguridad**: CORS, CSRF protection, Helmet, y Rate Limiting con `@nestjs/throttler`
- 📝 **Logging**: Integración con Pino para logging estructurado y de alto rendimiento
- 📚 **Documentación**: Swagger/OpenAPI automático
- 🧪 **Testing**: Jest configurado para unit tests y e2e tests
- 📏 **Code Quality**: ESLint, Prettier, y Commitlint configurados
- 🏗️ **Arquitectura**: Patrón de barrel exports y módulos bien estructurados
- 🔍 **Interceptors**: Correlation ID para trazabilidad de requests

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/AutanaSoft/nestjs-fastify-template.git
cd nestjs-fastify-template

# Instalar dependencias
pnpm install

# Configurar variables de entorno (opcional)
cp .env.example .env
```

### Desarrollo

```bash
# Modo desarrollo con hot reload
pnpm start:dev

# Modo producción
pnpm start:prod

# Modo debug
pnpm start:debug
```

La aplicación estará disponible en `http://localhost:4200/`

## 📋 Scripts Disponibles

```bash
# Desarrollo
pnpm start              # Servidor básico
pnpm start:dev          # Servidor con hot reload
pnpm start:debug        # Servidor en modo debug

# Testing
pnpm test               # Tests completos (unit + e2e + coverage merge)
pnpm test:unit          # Solo unit tests
pnpm test:e2e           # Solo end-to-end tests
pnpm coverage:merge     # Fusionar reportes de coverage

# Code Quality
pnpm lint               # ESLint con auto-fix
pnpm format             # Prettier formatting

# Build y Producción
pnpm build              # Compilar para producción
pnpm start:prod         # Ejecutar build de producción

# Herramientas
pnpm prepare            # Configurar hooks de Husky
```

## ⚙️ Configuración

### Variables de Entorno

````bash
```bash
```bash
# Variables requeridas para producción
APP_ENV=production
APP_PORT=4200
APP_HOST=0.0.0.0
LOG_LEVEL=info
LOG_DIR=/var/log/app
LOG_MAX_SIZE=50mb
CORS_ORIGIN_WHITELIST=https://app.yourdomain.com
COOKIE_SECRET=your-secure-secret
THROTTLER_LIMIT=100
````

```

```

### Configuración de Módulos

El proyecto utiliza configuración centralizada y tipada en `src/config/`:

- **`appConfig.ts`** - Configuración general de la aplicación (puerto, entorno, logging)
- **`corsConfig.ts`** - Configuración de CORS con whitelist inteligente de orígenes
- **`cookieConfig.ts`** - Configuración segura de cookies con FastifyCookieOptions
- **`throttlerConfig.ts`** - Configuración de rate limiting con desactivación automática en tests

> 📖 **Documentación detallada**: Cada módulo de configuración tiene documentación completa en [`/docs`](./docs/) incluyendo [PINO_LOGGER.md](./docs/PINO_LOGGER.md) para el sistema de logging estructurado

## 🛡️ Seguridad

### Rate Limiting (Throttling)

Protección automática contra ataques de fuerza bruta y abuso de API:

```typescript
// Configuración global: 100 requests por minuto (configurable)
// Personalizado por endpoint:
@Throttle({ default: { limit: 10, ttl: 60000 } })
@Get('sensitive')
getSensitiveData() { /* ... */ }

// Omitir throttling:
@SkipThrottle()
@Get('public')
getPublicData() { /* ... */ }
```

### CORS (Cross-Origin Resource Sharing)

Configuración robusta con whitelist de orígenes:

- **Desarrollo**: Permite cualquier origen si la whitelist está vacía
- **Producción**: Solo orígenes explícitamente permitidos
- **Credentials**: Habilitado para autenticación con cookies

### Cookies Seguras

Configuración adaptativa según el entorno:

- **Producción**: `secure: true`, `signed: true`, `sameSite: 'lax'`
- **Desarrollo**: `secure: false`, `signed: false`, `sameSite: 'none'`
- **Tests**: Automáticamente configurado para testing

### Protecciones Adicionales

- **Helmet**: Headers de seguridad HTTP automáticos
- **Validation**: Validación automática con `class-validator`
- **Correlation ID**: Trazabilidad de requests con interceptor global

## 📚 Documentación API

Swagger UI disponible en: `http://localhost:4200/v1/docs`

## 🏗️ Arquitectura

```
src/
├── config/              # Configuraciones centralizadas y tipadas
│   ├── appConfig.ts     # Configuración general de la aplicación
│   ├── corsConfig.ts    # Configuración CORS con whitelist
│   ├── cookieConfig.ts  # Configuración segura de cookies
│   ├── throttlerConfig.ts # Configuración de rate limiting
│   └── index.ts         # Barrel export para imports limpios
├── modules/             # Módulos de funcionalidad específica
│   └── hello/           # Ejemplo de módulo con arquitectura hexagonal
│       ├── hello.module.ts
│       ├── application/ # Casos de uso y servicios de aplicación
│       ├── domain/      # Entidades y lógica de negocio
│       └── infrastructure/ # Adapters y detalles técnicos
├── shared/              # Módulos compartidos e infraestructura
│   ├── infrastructure/  # Interceptors, middleware, adapters
│   ├── application/     # Decorators y servicios de aplicación
│   └── domain/         # Entidades e interfaces de dominio
├── app.module.ts       # Módulo principal con configuración global
├── app.controller.ts   # Controlador principal (health checks)
├── app.service.ts      # Servicio principal
└── main.ts            # Bootstrap de la aplicación con Fastify
```

### Patrones Implementados

- **Barrel Exports**: Imports limpios con archivos `index.ts`
- **Configuración Tipada**: Factory pattern con tipos TypeScript
- **Arquitectura Hexagonal**: Separación clara de capas (domain, application, infrastructure)
- **Guards Globales**: Rate limiting aplicado automáticamente
- **Interceptors Globales**: Correlation ID para trazabilidad de requests
- **Environment-Aware**: Comportamiento adaptativo según el entorno

## 🧪 Testing

```bash
# Tests completos (unit + e2e + merge de coverage)
pnpm test

# Solo unit tests con coverage
pnpm test:unit

# Solo e2e tests con coverage
pnpm test:e2e

# Fusionar reportes de coverage
pnpm coverage:merge
```

### Testing

- **Jest**: Framework de testing con @swc/jest para compilación rápida
- **Supertest**: Testing de endpoints HTTP
- **TestingModule**: Módulos de testing de NestJS
- **Coverage**: Reportes separados para unit tests y e2e tests
- **Environment**: Throttling deshabilitado automáticamente en tests

## 📦 Dependencias Principales

### Dependencias Principales

- `@nestjs/core` - Framework principal
- `@nestjs/platform-fastify` - Adaptador Fastify
- `@nestjs/config` - Gestión de configuración
- `@nestjs/swagger` - Documentación automática
- `@nestjs/throttler` - Rate limiting
- `nestjs-pino` - Logging estructurado
- `fastify` - Servidor HTTP de alto rendimiento
- `pino-roll` - Rotación de archivos de log
- `class-validator` - Validación de datos

### Dependencias de Desarrollo

- `typescript` - Lenguaje principal
- `eslint` - Linting con typescript-eslint
- `prettier` - Formateo de código
- `jest` - Framework de testing
- `@swc/core` - Compilador rápido para tests
- `commitlint` - Validación de commits
- `husky` - Git hooks
- `supertest` - Testing de endpoints

## 🔗 Recursos Útiles

### Documentación del Template

- **[Configuración de la Aplicación](./docs/APP_CONFIG.md)** - Variables de entorno y configuración general
- **[Configuración de Cookies](./docs/COOKIE_CONFIG.md)** - Seguridad y manejo de cookies
- **[Configuración de CORS](./docs/CORS_CONFIG.md)** - Cross-origin resource sharing y whitelist
- **[Configuración de Throttling](./docs/THROTTLER_CONFIG.md)** - Rate limiting y protección contra abuso
- **[Configuración de Logging](./docs/PINO_LOGGER.md)** - Sistema de logging estructurado con rotación de archivos

### Documentación Externa

- [Documentación de NestJS](https://docs.nestjs.com) - Framework principal
- [Documentación de Fastify](https://fastify.dev/docs) - Servidor HTTP de alto rendimiento
- [Pino Logger](https://getpino.io/) - Logging estructurado y rápido
- [Class Validator](https://github.com/typestack/class-validator) - Validación de datos

## 🚀 Despliegue

### Preparación para Producción

```bash
# Build de producción
pnpm build

# Ejecutar en producción
pnpm start:prod
```

### Variables de Entorno de Producción

```bash
APP_ENV=production
APP_PORT=4200
APP_HOST=0.0.0.0
APP_LOG_LEVEL=info

# Seguridad
COOKIE_SECRET=your-very-secure-random-string-min-32-chars
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=lax

# CORS con orígenes específicos
CORS_ORIGIN_WHITELIST=https://app.yourdomain.com,https://admin.yourdomain.com

# Rate limiting conservador
THROTTLER_TTL=60000
THROTTLER_LIMIT=100
```

### Consideraciones de Despliegue

- **Secrets**: Usa gestores de secretos para `COOKIE_SECRET` y otras claves
- **Monitoring**: Configura logs estructurados con Pino para observabilidad
- **Health Checks**: Endpoint `/health` disponible para load balancers
- **CORS**: Define explícitamente todos los orígenes permitidos
- **Rate Limiting**: Ajusta según tu patrón de tráfico esperado

## 📄 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una branch para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios siguiendo conventional commits
4. Push a la branch (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📖 **Documentación**: Revisa la [documentación completa](./docs/) del template
- 🐛 **Issues**: Abre un [Issue](https://github.com/AutanaSoft/nestjs-fastify-template/issues) para bugs o preguntas
- 💬 **Discusiones**: Usa las [GitHub Discussions](https://github.com/AutanaSoft/nestjs-fastify-template/discussions) para ideas y feedback
- 📧 **Contacto**: Contacta al equipo de desarrollo de AutanaSoft

---

<p align="center">
  Desarrollado con ❤️ por <a href="https://github.com/AutanaSoft">AutanaSoft</a>
</p>

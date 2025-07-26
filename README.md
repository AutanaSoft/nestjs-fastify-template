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
git clone <repository-url>
cd nest-template

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

La aplicación estará disponible en `http://localhost:4200/v1`

## 📋 Scripts Disponibles

```bash
# Desarrollo
pnpm start:dev          # Servidor con hot reload
pnpm start:debug        # Servidor en modo debug

# Testing
pnpm test               # Unit tests
pnpm test:watch         # Unit tests en modo watch
pnpm test:e2e           # End-to-end tests
pnpm test:cov           # Coverage report

# Code Quality
pnpm lint               # ESLint con auto-fix
pnpm format             # Prettier formatting

# Build
pnpm build              # Compilar para producción
pnpm start:prod         # Ejecutar build de producción
```

## ⚙️ Configuración

### Variables de Entorno

```bash
# Aplicación
APP_PORT=4200
APP_PREFIX=v1
APP_NAME="NestJS Template"
APP_VERSION="1.0.0"
APP_ENV=development
APP_LOG_LEVEL=debug

# Rate Limiting
THROTTLER_TTL=60000     # Ventana de tiempo (ms)
THROTTLER_LIMIT=10      # Límite de requests por ventana

# CORS (separadas por comas)
CORS_ORIGINS=http://localhost:3000,http://localhost:4200
CORS_METHODS=GET,POST,PUT,DELETE,PATCH
CORS_CREDENTIALS=true

# Cookies
COOKIE_SECRET=your-secret-key
COOKIE_SECURE=false     # true en producción
```

### Configuración de Módulos

El proyecto utiliza configuración centralizada en `src/config/`:

- `appConfig.ts` - Configuración general de la aplicación
- `corsConfig.ts` - Configuración de CORS
- `cookieConfig.ts` - Configuración de cookies
- `throttlerConfig.ts` - Configuración de rate limiting

## 🛡️ Seguridad

### Rate Limiting

```typescript
// Global: 10 requests por minuto (configurable)
// Personalizado por endpoint:
@Throttle({ default: { limit: 3, ttl: 60000 } })

// Omitir throttling:
@SkipThrottle()
```

### CORS

Configuración robusta con whitelist de orígenes permitidos.

### Protecciones Adicionales

- **Helmet**: Headers de seguridad
- **CSRF Protection**: Protección contra ataques CSRF
- **Validation**: Validación automática con `class-validator`

## 📚 Documentación API

Swagger UI disponible en: `http://localhost:4200/v1/docs`

## 🏗️ Arquitectura

```
src/
├── config/              # Configuraciones centralizadas
├── shared/              # Módulos compartidos e infraestructura
│   ├── infrastructure/  # Interceptors, middleware, adapters
│   ├── application/     # Decorators y servicios de aplicación
│   └── domain/         # Entidades e interfaces de dominio
├── app.module.ts       # Módulo principal
├── app.controller.ts   # Controlador principal
├── app.service.ts      # Servicio principal
└── main.ts            # Bootstrap de la aplicación
```

### Patrones Implementados

- **Barrel Exports**: Imports limpios con `index.ts`
- **Configuración por Factory**: Configuración asíncrona tipada
- **Guards Globales**: Rate limiting y autenticación
- **Interceptors Globales**: Correlation ID y logging

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

### Configuración de Testing

- **Jest**: Framework de testing
- **Supertest**: Testing de endpoints
- **TestingModule**: Módulos de testing de NestJS
- **Environment**: Throttling deshabilitado automáticamente en tests

## 📦 Dependencias Principales

### Runtime
- `@nestjs/core` - Framework principal
- `@nestjs/platform-fastify` - Adaptador Fastify
- `@nestjs/config` - Gestión de configuración
- `@nestjs/swagger` - Documentación automática
- `@nestjs/throttler` - Rate limiting
- `nestjs-pino` - Logging estructurado
- `fastify` - Servidor HTTP de alto rendimiento

### Development
- `typescript` - Lenguaje principal
- `eslint` - Linting
- `prettier` - Formateo de código
- `jest` - Framework de testing
- `commitlint` - Validación de commits

## 🔗 Recursos Útiles

- [Documentación de NestJS](https://docs.nestjs.com)
- [Documentación de Fastify](https://fastify.dev/docs)
- [Guía de Throttler](./docs/THROTTLER.md)

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

- Abre un [Issue](https://github.com/AutanaSoft/nestjs-fastify-template/issues)
- Revisa la [documentación](./docs/)
- Contacta al equipo de desarrollo
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

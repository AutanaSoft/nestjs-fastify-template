# Configuración de Jest con Paths y SWC

Esta documentación explica cómo está configurado Jest para trabajar con los paths de TypeScript y SWC en lugar de ts-jest.

## Configuración de Paths

Los paths están definidos en `tsconfig.json` y se han configurado tanto en SWC como en Jest para su correcta resolución:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@config/*": ["src/config/*"],
      "@shared/*": ["src/shared/*"],
      "@modules/*": ["src/modules/*"]
    }
  }
}
```

## Configuración de SWC (.swcrc)

SWC está configurado para manejar los paths de TypeScript y generar código CommonJS compatible con Jest:

```json
{
  "jsc": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@config/*": ["src/config/*"],
      "@shared/*": ["src/shared/*"],
      "@modules/*": ["src/modules/*"]
    }
  },
  "module": {
    "type": "commonjs",
    "strict": false,
    "strictMode": true,
    "lazy": false,
    "noInterop": false
  }
}
```

## Configuración de Jest (jest.config.ts)

Jest está configurado para usar SWC como transformador y mapear los paths correctamente:

```typescript
const config: Config = {
  transform: {
    '^.+\\.(t|j)s$': [
      '@swc/jest',
      {
        configFile: '.swcrc',
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
```

## Configuración de Jest E2E (test/jest-e2e.json)

Los tests e2e también están configurados para usar SWC y soportar paths:

```json
{
  "rootDir": "..",
  "transform": {
    "^.+\\.(t|j)s$": [
      "@swc/jest",
      {
        "configFile": ".swcrc"
      }
    ]
  },
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^src/(.*)$": "<rootDir>/src/$1"
  }
}
```

## Manejo de Imports de CommonJS

Para bibliotecas como `supertest`, se debe usar el import por defecto en lugar del import con namespace:

```typescript
// ❌ Incorrecto con SWC
import * as request from 'supertest';

// ✅ Correcto con SWC
import request from 'supertest';
```

## Uso de Paths en Tests

Una vez configurado, puedes usar los paths en tus tests:

```typescript
// En lugar de rutas relativas largas
import { HelloController } from '../../../../src/modules/hello/infrastructure/controllers/hello.controller';

// Usa paths limpios
import { HelloController } from '@modules/hello/infrastructure/controllers/hello.controller';
```

## Comandos de Testing

- `pnpm test` - Tests unitarios con SWC y paths
- `pnpm test:watch` - Tests unitarios en modo watch
- `pnpm test:e2e` - Tests e2e con SWC y paths
- `pnpm test:cov` - Tests con coverage

## Beneficios

1. **Performance**: SWC es más rápido que ts-jest
2. **Consistency**: Misma configuración de paths en toda la aplicación
3. **Maintainability**: Imports más limpios y fáciles de mantener
4. **Developer Experience**: Mejor experiencia de desarrollo con paths consistentes

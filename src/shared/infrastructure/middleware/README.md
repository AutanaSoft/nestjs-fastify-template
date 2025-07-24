# Infrastructure - Middleware

Esta carpeta contiene middleware que se ejecuta antes de los controllers para aspectos de infraestructura.

## Contenido típico:

- **Authentication Middleware**: Verificación de tokens/sesiones
- **CORS Middleware**: Configuración de CORS personalizada
- **Rate Limiting Middleware**: Control de límites de requests
- **Request Validation Middleware**: Validación temprana de requests
- **Security Headers Middleware**: Headers de seguridad
- **Body Parser Middleware**: Parseo personalizado de body

## Ejemplo de estructura:
```
middleware/
  auth.middleware.ts
  cors.middleware.ts
  rate-limit.middleware.ts
  validation.middleware.ts
  security-headers.middleware.ts
  index.ts
```

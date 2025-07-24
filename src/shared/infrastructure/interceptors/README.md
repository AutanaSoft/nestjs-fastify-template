# Infrastructure - Interceptors

Esta carpeta contiene interceptores que se usan en toda la aplicación para aspectos transversales de infraestructura.

## Contenido típico:

- **Logging Interceptor**: Intercepta requests/responses para logging
- **Response Transform Interceptor**: Transforma respuestas a formato estándar
- **Error Handling Interceptor**: Manejo centralizado de errores
- **Performance Interceptor**: Métricas de performance
- **Cache Interceptor**: Interceptor para manejo de cache
- **Correlation ID Interceptor**: Tracking de requests

## Ejemplo de estructura:
```
interceptors/
  logging.interceptor.ts
  response-transform.interceptor.ts
  error-handling.interceptor.ts
  performance.interceptor.ts
  cache.interceptor.ts
  index.ts
```

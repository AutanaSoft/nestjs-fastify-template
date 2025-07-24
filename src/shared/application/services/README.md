# Application - Services

Esta carpeta contiene servicios de aplicación que se utilizan en múltiples módulos.

## Contenido típico:

- **Crypto Service**: Encriptación, hashing, tokens
- **Validation Service**: Validaciones complejas reutilizables
- **File Service**: Manejo de archivos (upload, download, processing)
- **Email Service**: Envío de emails con templates
- **Notification Service**: Sistema de notificaciones
- **Audit Service**: Logging de auditoría
- **Cache Service**: Manejo de cache abstracto

## Ejemplo de estructura:
```
services/
  crypto.service.ts
  validation.service.ts
  file.service.ts
  email.service.ts
  notification.service.ts
  audit.service.ts
  cache.service.ts
  index.ts
```

## Ejemplo de contenido:
```typescript
// crypto.service.ts
@Injectable()
export class CryptoService {
  hashPassword(password: string): Promise<string> {
    // Implementation
  }
  
  generateToken(): string {
    // Implementation
  }
}
```

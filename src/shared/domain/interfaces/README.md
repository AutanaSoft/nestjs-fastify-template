# Domain - Interfaces

Esta carpeta contiene interfaces de dominio que definen contratos para la aplicación.

## Contenido típico:

- **Repository Interfaces**: Contratos para acceso a datos
- **Service Interfaces**: Contratos para servicios de dominio
- **Use Case Interfaces**: Contratos para casos de uso
- **Event Interfaces**: Definición de eventos de dominio
- **Gateway Interfaces**: Contratos para servicios externos
- **Specification Interfaces**: Contratos para especificaciones de negocio

## Ejemplo de estructura:
```
interfaces/
  repositories/
    base-repository.interface.ts
    user-repository.interface.ts
  services/
    domain-service.interface.ts
    notification-service.interface.ts
  use-cases/
    base-use-case.interface.ts
  events/
    domain-event.interface.ts
  gateways/
    payment-gateway.interface.ts
  index.ts
```

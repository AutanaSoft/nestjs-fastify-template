# Infrastructure - Adapters

Esta carpeta contiene adaptadores que conectan con servicios externos y tecnologías específicas.

## Contenido típico:

- **Database Adapters**: Adaptadores para diferentes bases de datos
- **External API Adapters**: Clientes para APIs externas
- **File System Adapters**: Manejo de archivos y storage
- **Email Service Adapters**: Servicios de email (SendGrid, SES, etc.)
- **Cache Adapters**: Redis, Memcached, etc.
- **Message Queue Adapters**: RabbitMQ, SQS, etc.
- **Payment Gateway Adapters**: Stripe, PayPal, etc.

## Ejemplo de estructura:
```
adapters/
  database/
    mongodb.adapter.ts
    postgresql.adapter.ts
  external-apis/
    payment-gateway.adapter.ts
    notification-service.adapter.ts
  storage/
    aws-s3.adapter.ts
    local-storage.adapter.ts
  index.ts
```

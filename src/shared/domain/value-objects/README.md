# Domain - Value Objects

Esta carpeta contiene value objects compartidos que encapsulan lógica de validación y comportamiento.

## Contenido típico:

- **Email Value Object**: Validación y formato de emails
- **ID Value Objects**: Diferentes tipos de identificadores (UUID, etc.)
- **Money Value Object**: Manejo de dinero con moneda
- **Date Range Value Object**: Rangos de fechas
- **Address Value Object**: Direcciones postales
- **Phone Number Value Object**: Números de teléfono
- **Password Value Object**: Passwords con validación

## Ejemplo de estructura:
```
value-objects/
  email.vo.ts
  uuid.vo.ts
  money.vo.ts
  date-range.vo.ts
  address.vo.ts
  phone-number.vo.ts
  password.vo.ts
  index.ts
```

## Ejemplo de contenido:
```typescript
// email.vo.ts
export class Email {
  constructor(private readonly value: string) {
    this.validate();
  }
  
  private validate(): void {
    // Validation logic
  }
  
  getValue(): string {
    return this.value;
  }
}
```

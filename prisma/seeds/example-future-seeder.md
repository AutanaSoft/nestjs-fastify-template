# Ejemplo de Estructura para Futuros Seeders

## Ejemplo: Seeder de Roles

```typescript
// prisma/seeds/roles/index.ts
import { Prisma, PrismaClient } from '@prisma/client';

const rolesData: Prisma.RoleCreateInput[] = [
  {
    name: 'SUPER_ADMIN',
    description: 'Super administrator with full access',
  },
  {
    name: 'ADMIN',
    description: 'Administrator with limited access',
  },
  {
    name: 'USER',
    description: 'Regular user with basic access',
  },
];

// Validación de datos
const validateRolesData = (roles: Prisma.RoleCreateInput[]): void => {
  console.log(`🔍 Validating ${roles.length} roles...`);

  const names = new Set<string>();

  for (const role of roles) {
    if (names.has(role.name)) {
      throw new Error(`Duplicate role name found: ${role.name}`);
    }
    names.add(role.name);

    if (!role.name || role.name.trim().length === 0) {
      throw new Error('Role name cannot be empty');
    }
  }

  console.log('✅ Roles data validation passed');
};

export const seedRoles = async (prisma: PrismaClient): Promise<void> => {
  console.log('🌱 Starting roles seeding...');

  // Validar datos antes de procesar
  validateRolesData(rolesData);

  await prisma.$transaction(
    async tx => {
      for (const roleData of rolesData) {
        console.log(`🏷️ Processing role: ${roleData.name}`);

        try {
          await tx.role.upsert({
            where: { name: roleData.name },
            update: {
              ...roleData,
            },
            create: {
              ...roleData,
            },
          });

          console.log(`   ✨ Role processed: ${roleData.name}`);
        } catch (error) {
          console.error(`   ❌ Error with ${roleData.name}:`, (error as Error).message);
          throw error;
        }
      }

      console.log('🎯 All roles processed successfully');
    },
    {
      timeout: 30000,
    },
  );

  console.log('✅ Roles seeding completed');
};
```

## Registro en seeds/index.ts

````typescript
import { PrismaClient } from '@prisma/client';
import { Seeder } from './_types';
import { seedUsers } from './user';
import { seedRoles } from './roles'; // Nuevo seeder

export const senderUsers: Seeder = {
  name: 'users',
  run: (prisma: PrismaClient) => seedUsers(prisma),
};

export const senderRoles: Seeder = {
  name: 'roles',
  run: (prisma: PrismaClient) => seedRoles(prisma),
};
```## Actualización en seed.ts

```typescript
// Lista simple de seeders a ejecutar
const seeds: Seeder[] = [senderRoles, senderUsers]; // roles primero por dependencias

// En la función main, cada seeder se ejecuta así:
await seeder.run(prisma); // Sin contexto, solo prisma
````

## Tipos Simplificados (\_types.ts)

```typescript
import { PrismaClient } from '@prisma/client';

export interface Seeder {
  name: string;
  run(prisma: PrismaClient): Promise<void>; // Sin contexto
}
```

## Patrón de Logs Consistente

Usar los siguientes emojis para mantener consistencia:

- `🔍` para validación de datos
- `🌱` para inicio del seeding
- `🏷️` o `👤` para procesar items (roles/usuarios)
- `✨` para items procesados exitosamente
- `❌` para errores
- `🎯` para resumen final
- `✅` para completado exitosamente

## Patrón de Orden de Dependencias

1. **roles** - Primero (sin dependencias)
2. **users** - Segundo (puede depender de roles)
3. **products** - Tercero (puede depender de users)
4. **orders** - Cuarto (depende de users y products)

El orden importa para evitar errores de claves foráneas.

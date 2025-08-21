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
  console.log(`Validating ${roles.length} roles...`);

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
      let created = 0;
      let updated = 0;

      for (const roleData of rolesData) {
        console.log(`Processing role: ${roleData.name}`);

        try {
          const existingRole = await tx.role.findUnique({
            where: { name: roleData.name },
            select: { id: true },
          });

          await tx.role.upsert({
            where: { name: roleData.name },
            update: {
              description: roleData.description,
            },
            create: roleData,
          });

          if (existingRole) {
            updated++;
            console.log(`  ✅ Updated: ${roleData.name}`);
          } else {
            created++;
            console.log(`  🆕 Created: ${roleData.name}`);
          }
        } catch (error) {
          console.error(`  ❌ Error with ${roleData.name}:`, (error as Error).message);
          throw error;
        }
      }

      console.log(`📊 Roles summary: ${created} created, ${updated} updated`);
    },
    {
      timeout: 30000,
    },
  );

  console.log('✅ Roles seeding completed');
};
```

## Registro en seeds/index.ts

```typescript
import { PrismaClient } from '@prisma/client';
import { SeedContext, Seeder } from './_types';
import { seedUsers } from './user';
import { seedRoles } from './roles'; // Nuevo seeder

export const senderUsers: Seeder = {
  name: 'users',
  run: (prisma: PrismaClient, _ctx: SeedContext) => seedUsers(prisma),
};

export const senderRoles: Seeder = {
  name: 'roles',
  run: (prisma: PrismaClient, _ctx: SeedContext) => seedRoles(prisma),
};
```

## Actualización en seed.ts

```typescript
// Lista simple de seeders a ejecutar
const seeds: Seeder[] = [senderRoles, senderUsers]; // roles primero por dependencias
```

## Patrón de Orden de Dependencias

1. **roles** - Primero (sin dependencias)
2. **users** - Segundo (puede depender de roles)
3. **products** - Tercero (puede depender de users)
4. **orders** - Cuarto (depende de users y products)

El orden importa para evitar errores de claves foráneas.

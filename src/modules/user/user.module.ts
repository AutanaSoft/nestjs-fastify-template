import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases';
import { FindUsersUseCase } from './application/use-cases/find-users.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { UserPrismaAdapter } from './infrastructure/adapters/user-prisma.adapter';
import { UserResolver } from './infrastructure/resolvers/user.resolver';

@Module({
  imports: [SharedModule],
  providers: [
    {
      provide: UserRepository,
      useClass: UserPrismaAdapter,
    },
    CreateUserUseCase,

    // FindUserByIdUseCase,
    // FindUserByEmailUseCase,
    // UpdateUserUseCase,
    FindUsersUseCase,
    UserResolver,
  ],
})
export class UserModule {}

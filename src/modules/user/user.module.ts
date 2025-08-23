import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases';
import { UserRepository } from './domain/repositories/user.repository';
import { UserPrismaAdapter } from './infrastructure/adapters/user-prisma.adapter';
import { UserResolver } from './infrastructure/resolvers/user.resolver';

@Module({
  imports: [],
  providers: [
    {
      provide: UserRepository,
      useClass: UserPrismaAdapter,
    },
    CreateUserUseCase,
    // FindUserByIdUseCase,
    // FindUserByEmailUseCase,
    // UpdateUserUseCase,
    // FindUsersUseCase,
    UserResolver,
  ],
})
export class UserModule {}

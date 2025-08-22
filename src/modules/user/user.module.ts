import { Module } from '@nestjs/common';
import {
  CreateUserUseCase,
  FindUserByEmailUseCase,
  FindUserByIdUseCase,
  FindUsersUseCase,
  UpdateUserUseCase,
} from './application/use-cases';
import { UserRepository } from './domain/repositories/user.repository';
import { UserPrismaAdapter } from './infrastructure/adapters/user-prisma.adapter';
import { UserResolver } from './infrastructure/resolvers/user.resolver';

@Module({
  controllers: [],
  providers: [
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    UpdateUserUseCase,
    FindUsersUseCase,
    {
      provide: UserRepository,
      useClass: UserPrismaAdapter,
    },
    UserResolver,
  ],
})
export class UserModule {}

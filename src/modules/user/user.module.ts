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
import { UserController } from './infrastructure/controllers/user.controller';

@Module({
  controllers: [UserController],
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
  ],
})
export class UserModule {}

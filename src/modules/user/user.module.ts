import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import {
  CreateUserUseCase,
  FindUserByEmailUseCase,
  FindUserByIdUseCase,
  FindUserByUsernameUseCase,
  FindUsersPaginatedUseCase,
  UpdateUserUseCase,
} from './application/use-cases';
import { UserRepository } from './domain/repositories';
import { UserPrismaAdapter } from './infrastructure/adapters';
import { UserResolver } from './infrastructure/resolvers';

@Module({
  imports: [SharedModule],
  providers: [
    {
      provide: UserRepository,
      useClass: UserPrismaAdapter,
    },
    CreateUserUseCase,
    UpdateUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    FindUserByUsernameUseCase,
    FindUsersPaginatedUseCase,
    UserResolver,
  ],
})
export class UserModule {}

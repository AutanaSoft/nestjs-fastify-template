import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { UserPrismaAdapter } from './infrastructure/adapters/user-prisma.adapter';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    FindUserByEmailUseCase,
    UpdateUserUseCase,
    {
      provide: UserRepository,
      useClass: UserPrismaAdapter,
    },
  ],
})
export class UserModule {}

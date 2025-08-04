import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UserCreateEntity, UserUpdateEntity } from '@modules/user/domain/types';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/adapters/prisma.service';

@Injectable()
export class UserPrismaAdapter extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findByUserName(userName: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { userName } });
    return user ? this.toDomain(user) : null;
  }

  async create(data: UserCreateEntity): Promise<UserEntity> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        userName: data.userName,
      },
    });
    return this.toDomain(createdUser);
  }

  async update(id: string, data: UserUpdateEntity): Promise<UserEntity> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    return this.toDomain(updatedUser);
  }

  private toDomain(prismaUser: User): UserEntity {
    return new UserEntity({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      userName: prismaUser.userName,
      status: prismaUser.status,
      role: prismaUser.role,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}

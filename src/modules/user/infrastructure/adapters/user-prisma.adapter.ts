import { UserEntity } from '@modules/user/domain/entities/user.entity';
import {
  CreateUserData,
  UpdateUserData,
  UserRepository,
} from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
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

  async create(data: CreateUserData): Promise<UserEntity> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password_hash,
      },
    });
    return this.toDomain(createdUser);
  }

  async update(id: string, data: UpdateUserData): Promise<UserEntity> {
    const { password_hash, ...rest } = data;

    const prismaData: {
      email?: string;
      status?: any;
      password?: string;
    } = { ...rest };

    if (password_hash) {
      prismaData.password = password_hash;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: prismaData,
    });
    return this.toDomain(updatedUser);
  }

  private toDomain(prismaUser: PrismaUser): UserEntity {
    return new UserEntity({
      id: prismaUser.id,
      email: prismaUser.email,
      status: prismaUser.status,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/adapters/prisma.service';
import { InjectPinoLogger } from 'nestjs-pino';
import { UserQueryParamsDto } from '../../application/dto';
import { UserCreateData, UserUpdateData } from '../../domain/types';

@Injectable()
export class UserPrismaAdapter extends UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    @InjectPinoLogger(UserPrismaAdapter.name)
    private readonly logger: Logger,
  ) {
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

  async create(data: UserCreateData): Promise<UserEntity> {
    // se tiene que crear un build de la data antes de crear el usuario
    if (!data.email || !data.password || !data.userName) {
      throw new Error('Email, password, and userName are required to create a user.');
    }

    // Validate that the user does not already exist
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new Error(`User with email ${data.email} already exists.`);
    }

    // Create the user in the database
    if (!data.userName) {
      data.userName = data.email; // Default userName to email if not provided
    }
    if (!data.password) {
      throw new Error('Password is required to create a user.');
    }

    const createdUser = await this.prisma.user.create({
      data,
    });

    return this.toDomain(createdUser);
  }

  async update(id: string, data: UserUpdateData): Promise<UserEntity> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    return this.toDomain(updatedUser);
  }

  async findAll(query: UserQueryParamsDto): Promise<UserEntity[]> {
    console.debug('Finding users with query', { query });
    const users = await this.prisma.user.findMany({ where: { ...query } });
    return users.map(user => this.toDomain(user));
  }

  private toDomain(prismaUser: User): UserEntity {
    return new UserEntity({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      // userName: prismaUser.userName,
      status: prismaUser.status,
      // role: prismaUser.role,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}

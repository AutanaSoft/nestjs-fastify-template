import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@/shared/application/services/prisma.service';
import { InjectPinoLogger } from 'nestjs-pino';
import { UserCreateData, UserFindAllData, UserUpdateData } from '../../domain/types';

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
    try {
      const createdUser = await this.prisma.user.create({
        data,
      });
      return this.toDomain(createdUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Prisma's error code for unique constraint violation
        if (error.code === 'P2002') {
          const fields = error.meta?.target as string[];
          const message = `User with this ${fields.join(' or ')} already exists.`;
          this.logger.warn(message, { fields });
          throw new ConflictException(message);
        }
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error('Failed to create user', { errorMessage, errorStack });
      throw new InternalServerErrorException('Could not create user.');
    }
  }

  async update(id: string, data: UserUpdateData): Promise<UserEntity> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });
      return this.toDomain(updatedUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          const message = `User with id ${id} not found.`;
          this.logger.warn(message, { id });
          throw new NotFoundException(message);
        }
        if (error.code === 'P2002') {
          const fields = error.meta?.target as string[];
          const message = `User with this ${fields.join(' or ')} already exists.`;
          this.logger.warn(message, { fields });
          throw new ConflictException(message);
        }
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error('Failed to create user', { errorMessage, errorStack });
      throw new InternalServerErrorException('Could not update user.');
    }
  }

  async findAll(query: UserFindAllData): Promise<UserEntity[]> {
    this.logger.debug('Finding users with query', { query });

    const conditions: Prisma.UserWhereInput[] = [];

    if (query.email) {
      conditions.push({ email: { contains: query.email, mode: 'insensitive' } });
    }
    if (query.userName) {
      conditions.push({ userName: { contains: query.userName, mode: 'insensitive' } });
    }
    if (query.status) {
      conditions.push({ status: query.status });
    }
    if (query.role) {
      conditions.push({ role: query.role });
    }
    if (query.createdAtFrom || query.createdAtTo) {
      const createdAtCondition: Prisma.DateTimeFilter = {};
      if (query.createdAtFrom) {
        createdAtCondition.gte = query.createdAtFrom; // Greater than or equal
      }
      if (query.createdAtTo) {
        createdAtCondition.lte = query.createdAtTo; // Less than or equal
      }
      conditions.push({ createdAt: createdAtCondition });
    }

    const where: Prisma.UserWhereInput = conditions.length > 0 ? { AND: conditions } : {};

    const users = await this.prisma.user.findMany({ where });
    return users.map(user => this.toDomain(user));
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

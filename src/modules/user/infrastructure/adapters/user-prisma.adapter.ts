import { PrismaService } from '@/shared/application/services/prisma.service';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { UserCreateData, UserFindAllData } from '../../domain/types'; // added UserStatus

@Injectable()
export class UserPrismaAdapter extends UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    @InjectPinoLogger(UserPrismaAdapter.name)
    private readonly logger: Logger,
  ) {
    super();
  }

  async create(data: UserCreateData): Promise<UserEntity> {
    try {
      const createdUser = await this.prisma.user.create({
        data,
      });
      return plainToInstance(UserEntity, createdUser);
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

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? plainToInstance(UserEntity, user) : null;
  }

  async findByUserName(userName: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { userName } });
    return user ? plainToInstance(UserEntity, user) : null;
  }

  async findAll(query: UserFindAllData): Promise<UserEntity[]> {
    try {
      const { filter, sort } = query;

      const conditions: Prisma.UserWhereInput[] = [];

      // Apply filters if query is provided
      if (filter) {
        if (filter.email) {
          conditions.push({ email: { contains: filter.email, mode: 'insensitive' } });
        }
        if (filter.userName) {
          conditions.push({ userName: { contains: filter.userName, mode: 'insensitive' } });
        }
        if (filter.status) {
          conditions.push({ status: filter.status });
        }
        if (filter.role) {
          conditions.push({ role: filter.role });
        }
        if (filter.createdAtFrom || filter.createdAtTo) {
          const createdAtCondition: Prisma.DateTimeFilter = {};
          if (filter.createdAtFrom) {
            createdAtCondition.gte = filter.createdAtFrom;
          }
          if (filter.createdAtTo) {
            createdAtCondition.lte = filter.createdAtTo;
          }
          conditions.push({ createdAt: createdAtCondition });
        }
      }

      const where: Prisma.UserWhereInput = conditions.length > 0 ? { AND: conditions } : {};

      // Build order by clause
      const orderBy: Prisma.UserOrderByWithRelationInput = {};
      if (sort?.sortBy) {
        orderBy[sort.sortBy] = sort.sortOrder || 'asc';
      } else {
        // Default sorting by createdAt desc if no sorting specified
        orderBy.createdAt = 'desc';
      }

      const users = await this.prisma.user.findMany({
        where,
        orderBy,
      });

      return users.map(user => plainToInstance(UserEntity, user));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error({ errorMessage, errorStack, query }, 'Failed to find users');
      throw new InternalServerErrorException('Could not retrieve users.');
    }
  }
}

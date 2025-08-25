import { PrismaService } from '@/shared/application/services/prisma.service';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { UserCreateData, UserFindAllData, UserUpdateData } from '../../domain/types'; // added UserStatus

/**
 * Prisma adapter implementation for user repository operations
 * Handles data persistence and retrieval using Prisma ORM with PostgreSQL
 * Implements proper error handling and logging for infrastructure concerns
 */
@Injectable()
export class UserPrismaAdapter extends UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    @InjectPinoLogger(UserPrismaAdapter.name)
    private readonly logger: Logger,
  ) {
    super();
  }

  /**
   * Creates a new user record in the database
   * Handles unique constraint violations and transforms Prisma errors to domain exceptions
   * @param data - User creation data containing all required and optional fields
   * @returns Promise resolving to the created user entity
   * @throws ConflictException when email or username already exists
   * @throws InternalServerErrorException for database errors
   */
  async create(data: UserCreateData): Promise<UserEntity> {
    try {
      const createdUser = await this.prisma.user.create({
        data,
      });
      return plainToInstance(UserEntity, createdUser);
    } catch (error) {
      this.processError(error);
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
      return plainToInstance(UserEntity, updatedUser);
    } catch (error) {
      this.processError(error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error('Failed to update user', { errorMessage, errorStack });
      throw new InternalServerErrorException('Could not update user.');
    }
  }

  /**
   * Finds a user by their ID
   * @param id - The ID of the user to find
   * @returns Promise resolving to user entity if found, null otherwise
   */
  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? plainToInstance(UserEntity, user) : null;
  }

  /**
   * Finds a user by their email address
   * @param email - The email address to search for
   * @returns Promise resolving to user entity if found, null otherwise
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? plainToInstance(UserEntity, user) : null;
  }

  /**
   * Finds a user by their username
   * @param userName - The username to search for
   * @returns Promise resolving to user entity if found, null otherwise
   */
  async findByUserName(userName: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { userName } });
    return user ? plainToInstance(UserEntity, user) : null;
  }

  /**
   * Retrieves users based on filter and sort criteria
   * Supports filtering by email, username, status, role, and date ranges
   * Implements case-insensitive search for text fields and proper date filtering
   * @param query - Query parameters containing optional filters and sorting options
   * @returns Promise resolving to array of user entities matching the criteria
   * @throws InternalServerErrorException for database query errors
   */
  async findAll(query: UserFindAllData): Promise<UserEntity[]> {
    try {
      const { filter, sort } = query;

      /** Build array of filter conditions to be combined with AND logic */
      const conditions: Prisma.UserWhereInput[] = [];

      // Apply filters if query is provided
      if (filter) {
        /** Apply case-insensitive email filter using contains */
        if (filter.email) {
          conditions.push({ email: { contains: filter.email, mode: 'insensitive' } });
        }
        /** Apply case-insensitive username filter using contains */
        if (filter.userName) {
          conditions.push({ userName: { contains: filter.userName, mode: 'insensitive' } });
        }
        /** Apply exact status filter */
        if (filter.status) {
          conditions.push({ status: filter.status });
        }
        /** Apply exact role filter */
        if (filter.role) {
          conditions.push({ role: filter.role });
        }
        /** Apply date range filter for creation date */
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

      /** Combine all conditions with AND logic, or use empty object for no filtering */
      const where: Prisma.UserWhereInput = conditions.length > 0 ? { AND: conditions } : {};

      /** Build order by clause with fallback to creation date descending */
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

  /**
   * Centralized error processing for Prisma-related errors
   * @param error - The error object to process
   */
  private processError(error: unknown): void {
    // Prisma's Client Known Request Errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // error code for unique constraint violation
      if (error.code === 'P2002') {
        const fields = error.meta?.target as string[];
        const message = `User with this ${fields.join(' or ')} already exists.`;
        this.logger.debug({ error }, message);
        throw new ConflictException(message);
      }

      // error code for record not found
      if (error.code === 'P2025') {
        this.logger.debug({ error }, `User not found`);
        throw new NotFoundException(`User not found`);
      }
    }
  }
}

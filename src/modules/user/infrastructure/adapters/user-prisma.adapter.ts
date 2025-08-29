import { PrismaService } from '@/shared/application/services/prisma.service';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaErrorHandlerService } from '@shared/infrastructure/services';
import { plainToInstance } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
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
    private readonly prismaErrorHandler: PrismaErrorHandlerService,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(UserPrismaAdapter.name);
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
    // Create a logger instance for this method
    const logger = this.logger;
    // Assign method context to the logger
    logger.assign({ method: 'create' });

    try {
      logger.debug({ data }, 'Creating user');
      const createdUser = await this.prisma.user.create({
        data,
      });
      logger.debug({ user: createdUser }, 'User created successfully');
      return plainToInstance(UserEntity, createdUser);
    } catch (error) {
      this.prismaErrorHandler.handleError(
        error,
        {
          messages: {
            uniqueConstraint: 'User with this email or username already exists',
            notFound: 'User not found',
            foreignKeyConstraint: 'Invalid reference in user data',
            validation: 'Invalid user data provided',
            connection: 'Database unavailable',
            unknown: 'An unexpected error occurred while creating user',
          },
          codes: {
            notFound: 'USER_NOT_FOUND',
          },
        },
        logger,
      );
    }
  }

  async update(id: string, data: UserUpdateData): Promise<UserEntity> {
    // Create a logger instance for this method
    const logger = this.logger;
    // Assign method context to the logger
    logger.assign({ method: 'update' });

    try {
      logger.debug({ query: { id, data } }, 'Updating user');

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });

      logger.debug({ user: updatedUser }, 'User updated successfully');

      return plainToInstance(UserEntity, updatedUser);
    } catch (error) {
      this.prismaErrorHandler.handleError(
        error,
        {
          messages: {
            uniqueConstraint: 'User with this email or username already exists',
            notFound: 'User not found',
            foreignKeyConstraint: 'Invalid reference in user data',
            validation: 'Invalid user data provided',
            connection: 'Database unavailable',
            unknown: 'An unexpected error occurred while updating user',
          },
          codes: {
            notFound: 'USER_NOT_FOUND',
          },
        },
        logger,
      );
    }
  }

  /**
   * Finds a user by their ID
   * @param id - The ID of the user to find
   * @returns Promise resolving to user entity if found, null otherwise
   */
  async findById(id: string): Promise<UserEntity | null> {
    // Create a logger instance for this method
    const logger = this.logger;
    // Assign method context to the logger
    logger.assign({ method: 'findById' });
    try {
      // Find user by ID
      logger.debug({ query: { id } }, 'Finding user by ID');
      const user = await this.prisma.user.findUnique({ where: { id } });

      // Check if user was found
      if (!user) {
        logger.debug({ user }, 'User not found by ID');
        return null;
      }

      // Map user to UserEntity
      logger.debug({ user }, 'User found by ID');
      return plainToInstance(UserEntity, user);
    } catch (error) {
      this.prismaErrorHandler.handleError(
        error,
        {
          messages: {
            notFound: 'User not found',
            connection: 'Database unavailable',
            unknown: 'An unexpected error occurred while finding user',
          },
        },
        logger,
      );
    }
  }

  /**
   * Finds a user by their email address
   * @param email - The email address to search for
   * @returns Promise resolving to user entity if found, null otherwise
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    // Create a logger instance for this method
    const logger = this.logger;
    // Assign method context to the logger
    logger.assign({ method: 'findByEmail' });

    try {
      // Find user by email
      logger.debug({ query: { email } }, 'Finding user by email');
      const user = await this.prisma.user.findUnique({ where: { email } });

      // Check if user was found
      if (!user) {
        logger.debug({ user }, 'User not found by email');
        return null;
      }

      // Map user to UserEntity
      logger.debug({ user }, 'User found by email');
      return plainToInstance(UserEntity, user);
    } catch (error) {
      this.prismaErrorHandler.handleError(
        error,
        {
          messages: {
            notFound: 'User not found',
            connection: 'Database unavailable',
            unknown: 'An unexpected error occurred while finding user',
          },
        },
        logger,
      );
    }
  }

  /**
   * Finds a user by their username
   * @param userName - The username to search for
   * @returns Promise resolving to user entity if found, null otherwise
   */
  async findByUserName(userName: string): Promise<UserEntity | null> {
    // Create a logger instance for this method
    const logger = this.logger;
    logger.assign({ method: 'findByUserName' });

    try {
      // Find user by username
      logger.debug({ query: { userName } }, 'Finding user by username');
      const user = await this.prisma.user.findUnique({ where: { userName } });

      // Check if user was found
      if (!user) {
        logger.debug({ user }, 'User not found by username');
        return null;
      }

      // Map user to UserEntity
      logger.debug({ user }, 'User found by username');
      return plainToInstance(UserEntity, user);
    } catch (error) {
      this.prismaErrorHandler.handleError(
        error,
        {
          messages: {
            notFound: 'User not found',
            connection: 'Database unavailable',
            unknown: 'An unexpected error occurred while finding user',
          },
        },
        logger,
      );
    }
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
      this.prismaErrorHandler.handleError(
        error,
        {
          messages: {
            validation: 'Invalid query parameters provided',
            connection: 'Database unavailable',
            unknown: 'An unexpected error occurred while fetching users',
          },
        },
        this.logger,
      );
    }
  }
}

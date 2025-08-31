import { PrismaService } from '@/shared/application/services/prisma.service';
import { PaginatedData } from '@/shared/domain/types';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaErrorHandlerService } from '@shared/infrastructure/services';
import { plainToInstance } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { UserCreateData, UserFindAllPaginateData, UserUpdateData } from '../../domain/types';

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
        logger.debug('User not found by ID');
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
      const user = await this.prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
      });

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
   * Retrieves paginated users based on filter, sort, and pagination criteria
   * Supports filtering by email, username, status, role, and date ranges
   * Implements case-insensitive search for text fields and proper date filtering
   * Returns only data and count - no pagination calculations
   * @param query - Query parameters including skip, take, optional filters and sorting options
   * @returns Promise resolving to data and total count only
   * @throws InternalServerErrorException for database query errors
   */
  async findAllPaginated(query: UserFindAllPaginateData): Promise<PaginatedData<UserEntity>> {
    // Create a logger instance for this method
    this.logger.assign({ method: 'findAllPaginated' });

    try {
      const { filter, orderBy, page, take } = query;
      const skip = (page - 1) * take;

      /** Build array of filter conditions to be combined with AND logic */
      const conditions: Prisma.UserWhereInput[] = [];

      // Apply filters if query is provided
      if (filter) {
        this.logger.debug('Applying filters to user search');
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
      this.logger.debug({ where }, 'Final where clause constructed');

      /** Build order by clause with fallback to creation date descending */
      const orderByClause: Prisma.UserOrderByWithRelationInput = {};
      if (orderBy?.by) {
        orderByClause[orderBy.by] = orderBy.order || 'asc';
      } else {
        // Default sorting by createdAt desc if no sorting specified
        orderByClause.createdAt = 'desc';
      }
      this.logger.debug({ orderBy: orderByClause }, 'Final order by clause constructed');

      // Execute queries in parallel for better performance
      const [users, totalDocs] = await Promise.all([
        this.prisma.user.findMany({
          where,
          orderBy: orderByClause,
          skip,
          take,
        }),
        this.prisma.user.count({ where }),
      ]);

      this.logger.debug({ queryResult: { users, totalDocs } }, 'Found paginated users');

      // Return only data and count - let use case handle pagination calculations
      return {
        data: users.map(user => plainToInstance(UserEntity, user)),
        totalDocs,
      };
    } catch (error) {
      this.prismaErrorHandler.handleError(
        error,
        {
          messages: {
            validation: 'Invalid query parameters provided',
            connection: 'Database unavailable',
            unknown: 'An unexpected error occurred while fetching paginated users',
          },
        },
        this.logger,
      );
    }
  }
}

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
 * Prisma adapter implementation for User repository
 *
 * This adapter implements the UserRepository interface from the domain layer
 * using Prisma ORM to interact with the PostgreSQL database. It handles:
 * - CRUD operations for user entities
 * - Data transformation between Prisma models and domain entities
 * - Advanced filtering and pagination for user queries
 * - Proper error handling with domain-specific exceptions
 * - Comprehensive logging for all database operations
 *
 * Following hexagonal architecture principles, this adapter isolates the
 * infrastructure concerns (Prisma, database) from the domain logic.
 */
@Injectable()
export class UserPrismaAdapter extends UserRepository {
  /**
   * Creates a new UserPrismaAdapter instance
   *
   * @param prisma - Prisma service for database operations
   * @param prismaErrorHandler - Service for handling Prisma-specific errors
   * @param logger - Pino logger for structured logging
   */
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
    // Assign method context to the logger
    this.logger.assign({ method: 'create' });

    try {
      this.logger.debug('Creating new user');
      const user = await this.prisma.user.create({
        data,
      });
      this.logger.assign({ user });
      this.logger.debug('User created successfully');
      this.logger.debug('Transforming user to UserEntity');
      return plainToInstance(UserEntity, user);
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
        this.logger,
      );
    }
  }

  /**
   * Updates an existing user record in the database
   * Handles unique constraint violations and transforms Prisma errors to domain exceptions
   * @param id - The unique identifier of the user to update
   * @param data - User update data containing fields to be modified
   * @returns Promise resolving to the updated user entity
   * @throws NotFoundException when user with specified ID does not exist
   * @throws ConflictException when update would violate unique constraints
   * @throws InternalServerErrorException for database errors
   */
  async update(id: string, data: UserUpdateData): Promise<UserEntity> {
    // Assign method context to the logger
    this.logger.assign({ method: 'update' });

    try {
      this.logger.debug('Updating user');
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });
      this.logger.debug('User updated successfully');

      this.logger.debug('Transforming user to UserEntity');
      return plainToInstance(UserEntity, user);
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
        this.logger,
      );
    }
  }

  /**
   * Finds a user by their ID
   * @param id - The ID of the user to find
   * @returns Promise resolving to user entity if found, null otherwise
   */
  async findById(id: string): Promise<UserEntity | null> {
    // Assign method context to the logger
    this.logger.assign({ method: 'findById' });
    try {
      // Find user by ID
      this.logger.debug('Finding user by ID');
      const user = await this.prisma.user.findUnique({ where: { id } });
      this.logger.assign({ user });

      // Check if user was found
      if (!user) {
        this.logger.debug('User not found by ID');
        return null;
      }
      this.logger.debug('User found by ID');

      // Map user to UserEntity
      this.logger.debug('Transforming user to UserEntity');
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
        this.logger,
      );
    }
  }

  /**
   * Finds a user by their email address
   * @param email - The email address to search for
   * @returns Promise resolving to user entity if found, null otherwise
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    // Assign method context to the logger
    this.logger.assign({ method: 'findByEmail' });
    this.logger.debug('Searching for user by email');

    try {
      const where: Prisma.UserWhereInput = { email: { equals: email, mode: 'insensitive' } };
      this.logger.assign({ where });
      this.logger.debug('Where clause for finding user by email');
      // Find user by email
      const user = await this.prisma.user.findFirst({
        where,
      });

      // Check if user was found
      if (!user) {
        this.logger.debug('User not found by email');
        return null;
      }

      // Map user to UserEntity
      this.logger.assign({ user });
      this.logger.debug('User found by email');
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
        this.logger,
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
    this.logger.assign({ method: 'findByUserName' });

    try {
      // Find user by username
      this.logger.debug('Finding user by userName');
      const user = await this.prisma.user.findUnique({ where: { userName } });
      this.logger.assign({ user });

      // Check if user was found
      if (!user) {
        this.logger.debug('User not found by userName');
        return null;
      }
      this.logger.debug('User found by userName');

      // Map user to UserEntity
      this.logger.debug('Transforming user to UserEntity');
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
        this.logger,
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
      this.logger.assign({ where });
      this.logger.debug('Final where clause constructed');

      /** Build order by clause with fallback to creation date descending */
      const orderByClause: Prisma.UserOrderByWithRelationInput = {};
      if (orderBy?.by) {
        orderByClause[orderBy.by] = orderBy.order || 'asc';
      } else {
        // Default sorting by createdAt desc if no sorting specified
        orderByClause.createdAt = 'desc';
      }

      this.logger.assign({ orderBy: orderByClause });
      this.logger.debug('Final order by clause constructed');

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

      this.logger.assign({ users, totalDocs });
      this.logger.debug('Found paginated users');

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

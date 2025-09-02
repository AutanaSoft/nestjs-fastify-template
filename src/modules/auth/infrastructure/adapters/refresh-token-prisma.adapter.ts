import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { PrismaService } from '@/shared/application/services';
import { plainToInstance } from 'class-transformer';
import { RefreshTokenEntity } from '../../domain/entities';
import { RefreshTokenRepository } from '../../domain/repositories';
import { RefreshTokenData } from '../../domain/types';

/**
 * Prisma adapter for refresh token persistence operations
 * Handles only basic CRUD operations following hexagonal architecture principles
 * Business logic and validations are handled in domain services and use cases
 */
@Injectable()
export class RefreshTokenPrismaAdapter implements RefreshTokenRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RefreshTokenPrismaAdapter.name);
  }

  /**
   * Generates a new unique identifier for a refresh token
   * @returns Promise resolving to the new refresh token identifier
   */
  async generateSubId(): Promise<string> {
    this.logger.assign({ method: 'generateSubId' });
    try {
      const subId = await this.prisma.$queryRaw<{ id: string }[]>`SELECT gen_random_uuid() AS id`;
      this.logger.debug({ subId }, 'Generated new refresh token sub ID');
      return subId[0].id;
    } catch (error: unknown) {
      this.logger.error({ error }, 'Failed to generate refresh token sub ID');
      throw new Error('Failed to generate refresh token sub ID');
    }
  }

  /**
   * Creates a new refresh token in the database
   */
  async create(refreshToken: RefreshTokenData): Promise<RefreshTokenEntity> {
    this.logger.assign({ method: 'create' });

    try {
      const createdToken = await this.prisma.refreshToken.create({ data: refreshToken });
      return plainToInstance(RefreshTokenEntity, createdToken);
    } catch (error: unknown) {
      this.logger.error({ error }, 'Failed to create refresh token');
      throw new Error('Failed to create refresh token');
    }
  }

  /**
   * Finds a refresh token by its unique identifier
   */
  async findById(id: string): Promise<RefreshTokenEntity | null> {
    this.logger.assign({ method: 'findById', tokenId: id });

    try {
      const refreshToken: any = await this.prisma.refreshToken.findUnique({
        where: { id },
      });

      if (!refreshToken) {
        return null;
      }

      return plainToInstance(RefreshTokenEntity, refreshToken);
    } catch (error: unknown) {
      this.logger.error({ error, tokenId: id }, 'Failed to find refresh token by ID');
      throw new Error('Failed to find refresh token by ID');
    }
  }

  /**
   * Finds a refresh token by its token hash
   */
  async findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
    this.logger.assign({ method: 'findByTokenHash' });

    try {
      const refreshToken: any = await this.prisma.refreshToken.findUnique({
        where: { tokenHash },
      });

      if (!refreshToken) {
        return null;
      }

      return plainToInstance(RefreshTokenEntity, refreshToken);
    } catch (error: unknown) {
      this.logger.error({ error }, 'Failed to find refresh token by token hash');
      throw new Error('Failed to find refresh token by token hash');
    }
  }

  /**
   * Finds all refresh tokens for a specific user
   */
  async findByUserId(userId: string): Promise<RefreshTokenEntity[]> {
    this.logger.assign({ method: 'findByUserId', userId });

    try {
      const tokens: any[] = await this.prisma.refreshToken.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return tokens.map(token => plainToInstance(RefreshTokenEntity, token));
    } catch (error: unknown) {
      this.logger.error({ error, userId }, 'Failed to find refresh tokens by user ID');
      throw new Error('Failed to find refresh tokens by user ID');
    }
  }

  /**
   * Updates an existing refresh token
   */
  async update(id: string, data: RefreshTokenData): Promise<RefreshTokenEntity> {
    this.logger.assign({ method: 'update', tokenId: id });

    try {
      const updatedToken: any = await this.prisma.refreshToken.update({
        where: { id },
        data,
      });

      return plainToInstance(RefreshTokenEntity, updatedToken);
    } catch (error: unknown) {
      this.logger.error({ error, tokenId: id }, 'Failed to update refresh token');
      throw new Error('Failed to update refresh token');
    }
  }

  /**
   * Updates multiple refresh tokens that match the given criteria
   */
  async updateMany(
    where: { userId?: string; tokenHash?: string; revokedAt?: Date | null },
    data: RefreshTokenData,
  ): Promise<number> {
    this.logger.assign({ method: 'updateMany', where });

    try {
      const result = await this.prisma.refreshToken.updateMany({
        where,
        data,
      });

      return result.count;
    } catch (error: unknown) {
      this.logger.error({ error, where }, 'Failed to update multiple refresh tokens');
      throw new Error('Failed to update multiple refresh tokens');
    }
  }
}

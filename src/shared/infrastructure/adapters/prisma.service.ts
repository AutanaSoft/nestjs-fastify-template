import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Logger } from 'nestjs-pino';

import { DatabaseConfig } from '@config/databaseConfig';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    const databaseConfig = configService.get<DatabaseConfig>('databaseConfig')!;

    super({
      datasources: {
        db: {
          url: databaseConfig.url,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connection established successfully', {
        context: 'PrismaService',
      });
    } catch (error) {
      this.logger.error('Failed to connect to database', {
        context: 'PrismaService',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database connection closed successfully', {
        context: 'PrismaService',
      });
    } catch (error) {
      this.logger.error('Error while disconnecting from database', {
        context: 'PrismaService',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Execute database operation with logging and error handling
   */
  async executeWithLogging<T>(
    operation: () => Promise<T>,
    operationName: string,
    correlationId?: string,
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await operation();
      const duration = Date.now() - startTime;

      this.logger.log('Database operation completed successfully', {
        context: 'PrismaService',
        operation: operationName,
        duration: `${duration}ms`,
        correlationId,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error('Database operation failed', {
        context: 'PrismaService',
        operation: operationName,
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : 'Unknown error',
        correlationId,
      });

      throw error;
    }
  }

  /**
   * Health check method for database connection
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; message: string }> {
    try {
      await this.$queryRaw`SELECT 1`;
      return { status: 'ok', message: 'Database connection is healthy' };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Database health check failed',
      };
    }
  }
}

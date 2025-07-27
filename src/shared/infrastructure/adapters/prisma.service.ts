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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      datasources: {
        db: {
          url: databaseConfig.url,
        },
      },
      log: databaseConfig.logging
        ? [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'event' },
            { level: 'info', emit: 'event' },
            { level: 'warn', emit: 'event' },
          ]
        : [],
    });

    // Setup database logging integration with Pino
    if (databaseConfig.logging) {
      this.setupLogging();
    }
  }

  async onModuleInit() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this.$queryRaw`SELECT 1`;
      return { status: 'ok', message: 'Database connection is healthy' };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Database health check failed',
      };
    }
  }

  private setupLogging(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.$on('query', (e: any) => {
      this.logger.debug('Database query executed', {
        context: 'PrismaQuery',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        query: e.query,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        params: JSON.stringify(e.params),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        duration: `${e.duration}ms`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        timestamp: e.timestamp,
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.$on('error', (e: any) => {
      this.logger.error('Database error occurred', {
        context: 'PrismaError',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        target: e.target,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: e.message,
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.$on('info', (e: any) => {
      this.logger.log('Database info', {
        context: 'PrismaInfo',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: e.message,
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.$on('warn', (e: any) => {
      this.logger.warn('Database warning', {
        context: 'PrismaWarn',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: e.message,
      });
    });
  }
}

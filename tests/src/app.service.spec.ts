import { AppService } from '@/app.service';
import { PrismaService } from '@/shared/application/services';
import { AppConfig } from '@config/appConfig';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppInfoResponseDto } from '@shared/application/dto';
import { DatabaseHealthDto } from '@shared/application/dto/health-check-response.dto';

describe('AppService', () => {
  let service: AppService;

  const mockPrismaService = {
    healthCheck: jest.fn(),
  };

  const mockCorrelationService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const appConfig: AppConfig = {
    name: 'Test App',
    description: 'Test Description',
    version: '1.0.0',
    host: 'localhost',
    port: 3000,
    prefix: 'v1',
    environment: 'test',
    logLevel: 'debug',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);

    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'appConfig') {
        return appConfig;
      }
      return undefined;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAppInfo', () => {
    it('should return app info', () => {
      const correlationId = 'test-correlation-id';
      mockCorrelationService.get.mockReturnValue(correlationId);

      const expected: AppInfoResponseDto = {
        name: appConfig.name,
        version: appConfig.version,
        message: 'Welcome to NestJS Template API',
      };

      const result = service.getAppInfo();
      expect(result).toEqual(expected);
    });
  });

  describe('getHealth', () => {
    it('should return health status', async () => {
      const correlationId = 'test-correlation-id';
      const dbHealth: DatabaseHealthDto = { status: 'ok', message: 'Database is healthy' };

      mockCorrelationService.get.mockReturnValue(correlationId);
      mockPrismaService.healthCheck.mockResolvedValue(dbHealth);

      const result = await service.getHealth();

      expect(result.name).toBe(appConfig.name);
      expect(result.version).toBe(appConfig.version);
      expect(result.status).toBe('ok');
      expect(result.database).toEqual(dbHealth);
      expect(result.timestamp).toBeDefined();
    });
  });
});

import { AppResolver } from '@/app.resolver';
import { AppService } from '@/app.service';
import { AppInfoResponseDto, HealthCheckResponseDto } from '@shared/application/dto';
import { DatabaseHealthDto } from '@shared/application/dto/health-check-response.dto';
import { PrismaService } from '@shared/infrastructure/adapters';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppController', () => {
  let appController: AppResolver;

  const mockAppService = {
    getAppInfo: jest.fn(),
    getHealth: jest.fn(),
  };

  const mockPrismaService = {
    healthCheck: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppResolver],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    appController = module.get<AppResolver>(AppResolver);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getAppInfo', () => {
    it('should return application info', () => {
      const appInfo: AppInfoResponseDto = {
        name: 'NestJS Template',
        version: '1.0.0',
        message: 'Welcome to NestJS Template API',
        correlationId: 'test-id',
      };
      mockAppService.getAppInfo.mockReturnValue(appInfo);

      const result = appController.getAppInfo();

      expect(result).toEqual(appInfo);
      expect(mockAppService.getAppInfo).toHaveBeenCalled();
    });
  });

  describe('getHealth', () => {
    it('should return health check status', async () => {
      const healthCheck: HealthCheckResponseDto = {
        status: 'ok',
        name: 'NestJS Template',
        version: '1.0.0',
        database: { status: 'ok' } as DatabaseHealthDto,
        correlationId: 'test-id',
        timestamp: new Date().toISOString(),
      };
      mockAppService.getHealth.mockResolvedValue(healthCheck);

      const result = await appController.getHealth();

      expect(result).toEqual(healthCheck);
      expect(mockAppService.getHealth).toHaveBeenCalled();
    });
  });
});

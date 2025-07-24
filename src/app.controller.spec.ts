import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig } from './config';

describe('AppController', () => {
  let appController: AppController;

  const mockAppConfig: AppConfig = {
    name: 'Test App',
    description: 'Test Application',
    version: '1.0.0',
    host: 'localhost',
    environment: 'test',
    logLevel: 'info',
    port: 4200,
    prefix: 'v1',
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'appConfig') {
        return mockAppConfig;
      }
      return undefined;
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('getAppSettings', () => {
    it('should return app configuration', () => {
      const result = appController.getAppSettings();
      expect(result).toEqual(mockAppConfig);
    });
  });

  describe('sayHello', () => {
    it('should return personalized greeting', () => {
      const testName = 'John Doe';
      const result = appController.sayHello({ name: testName });
      expect(result).toBe(`Hello, ${testName} from ${mockAppConfig.name}!`);
    });
  });
});

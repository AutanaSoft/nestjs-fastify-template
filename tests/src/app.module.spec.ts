import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { AppResolver } from '@/app.resolver';
import { AppService } from '@/app.service';
import { PrismaService } from '@shared/infrastructure/adapters';
import { CorrelationService } from '@shared/application';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AppController', () => {
    const controller = module.get<AppResolver>(AppResolver);
    expect(controller).toBeDefined();
  });

  it('should have AppService', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeDefined();
  });

  it('should have PrismaService', () => {
    const service = module.get<PrismaService>(PrismaService);
    expect(service).toBeDefined();
  });

  it('should have CorrelationService', () => {
    const service = module.get<CorrelationService>(CorrelationService);
    expect(service).toBeDefined();
  });
});

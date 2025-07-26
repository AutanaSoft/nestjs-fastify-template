import { Test, TestingModule } from '@nestjs/testing';
import { HelloService } from '../../../../../src/modules/hello/domain/services/hello.service';

describe('HelloService', () => {
  let service: HelloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelloService],
    }).compile();

    service = module.get<HelloService>(HelloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHelloMessage', () => {
    it('should return "Hola Mundo!"', () => {
      const result = service.getHelloMessage();
      expect(result).toBe('Hola Mundo!');
    });
  });

  describe('sayHello', () => {
    it('should return personalized greeting', () => {
      const name = 'Juan';
      const result = service.sayHello(name);
      expect(result).toBe('Hola Juan!');
    });

    it('should handle different names', () => {
      const name = 'María';
      const result = service.sayHello(name);
      expect(result).toBe('Hola María!');
    });
  });
});

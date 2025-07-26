import { Test, TestingModule } from '@nestjs/testing';
import { SayHelloUseCase } from '../../../../src/modules/hello/application/use-cases/say-hello.use-case';
import { HelloService } from '../../../../src/modules/hello/domain/services/hello.service';
import {
  HelloResponseDto,
  SayHelloRequestDto,
} from '../../../../src/modules/hello/application/dto';

describe('SayHelloUseCase', () => {
  let useCase: SayHelloUseCase;
  let helloService: HelloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SayHelloUseCase,
        {
          provide: HelloService,
          useValue: {
            sayHello: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<SayHelloUseCase>(SayHelloUseCase);
    helloService = module.get<HelloService>(HelloService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return HelloResponseDto with personalized message', () => {
      const mockRequest = new SayHelloRequestDto();
      mockRequest.name = 'Juan';
      const mockMessage = 'Hola Juan!';

      const sayHelloSpy = jest.spyOn(helloService, 'sayHello').mockReturnValue(mockMessage);

      const result = useCase.execute(mockRequest);

      expect(result).toBeInstanceOf(HelloResponseDto);
      expect(result.msg).toBe(mockMessage);
      expect(sayHelloSpy).toHaveBeenCalledWith('Juan');
      expect(sayHelloSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle different names', () => {
      const mockRequest = new SayHelloRequestDto();
      mockRequest.name = 'María';
      const mockMessage = 'Hola María!';

      const sayHelloSpy = jest.spyOn(helloService, 'sayHello').mockReturnValue(mockMessage);

      const result = useCase.execute(mockRequest);

      expect(result).toBeInstanceOf(HelloResponseDto);
      expect(result.msg).toBe(mockMessage);
      expect(sayHelloSpy).toHaveBeenCalledWith('María');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from '../../../../src/modules/hello/infrastructure/controllers/hello.controller';
import {
  GetHelloUseCase,
  SayHelloUseCase,
} from '../../../../src/modules/hello/application/use-cases';
import {
  HelloResponseDto,
  SayHelloRequestDto,
} from '../../../../src/modules/hello/application/dto';

describe('HelloController', () => {
  let controller: HelloController;
  let getHelloUseCase: GetHelloUseCase;
  let sayHelloUseCase: SayHelloUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
      providers: [
        {
          provide: GetHelloUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: SayHelloUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HelloController>(HelloController);
    getHelloUseCase = module.get<GetHelloUseCase>(GetHelloUseCase);
    sayHelloUseCase = module.get<SayHelloUseCase>(SayHelloUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('hello', () => {
    it('should return result from GetHelloUseCase', () => {
      const mockResult = new HelloResponseDto('Hola Mundo!');
      const getHelloSpy = jest.spyOn(getHelloUseCase, 'execute').mockReturnValue(mockResult);

      const result = controller.hello();

      expect(result).toBe(mockResult);
      expect(getHelloSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('sayHello', () => {
    it('should return result from SayHelloUseCase', () => {
      const mockRequest = new SayHelloRequestDto();
      mockRequest.name = 'Juan';
      const mockResult = new HelloResponseDto('Hola Juan!');

      const sayHelloSpy = jest.spyOn(sayHelloUseCase, 'execute').mockReturnValue(mockResult);

      const result = controller.sayHello(mockRequest);

      expect(result).toBe(mockResult);
      expect(sayHelloSpy).toHaveBeenCalledWith(mockRequest);
      expect(sayHelloSpy).toHaveBeenCalledTimes(1);
    });
  });
});

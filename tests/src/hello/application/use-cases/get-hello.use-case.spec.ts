import { Test, TestingModule } from '@nestjs/testing';
import { GetHelloUseCase } from '../../../../../src/modules/hello/application/use-cases/get-hello.use-case';
import { HelloService } from '../../../../../src/modules/hello/domain/services/hello.service';
import { HelloResponseDto } from '../../../../../src/modules/hello/application/dto';

describe('GetHelloUseCase', () => {
  let useCase: GetHelloUseCase;
  let helloService: HelloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetHelloUseCase,
        {
          provide: HelloService,
          useValue: {
            getHelloMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetHelloUseCase>(GetHelloUseCase);
    helloService = module.get<HelloService>(HelloService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return HelloResponseDto with message from service', () => {
      const mockMessage = 'Hola Mundo!';
      const getHelloMessageSpy = jest
        .spyOn(helloService, 'getHelloMessage')
        .mockReturnValue(mockMessage);

      const result = useCase.execute();

      expect(result).toBeInstanceOf(HelloResponseDto);
      expect(result.msg).toBe(mockMessage);
      expect(getHelloMessageSpy).toHaveBeenCalledTimes(1);
    });
  });
});

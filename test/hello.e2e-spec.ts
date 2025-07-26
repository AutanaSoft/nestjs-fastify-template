import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { HelloModule } from '../src/modules/hello/hello.module';

describe('HelloController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HelloModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/hello (GET)', () => {
    it('should return hello world message', () => {
      return request(app.getHttpServer()).get('/hello').expect(200).expect({
        msg: 'Hola Mundo!',
      });
    });
  });

  describe('/hello/say (POST)', () => {
    it('should return personalized greeting', () => {
      return request(app.getHttpServer())
        .post('/hello/say')
        .send({ name: 'Juan' })
        .expect(201)
        .expect({
          msg: 'Hola Juan!',
        });
    });

    it('should return 400 for missing name', () => {
      return request(app.getHttpServer()).post('/hello/say').send({}).expect(400);
    });

    it('should return 400 for empty name', () => {
      return request(app.getHttpServer()).post('/hello/say').send({ name: '' }).expect(400);
    });
  });
});

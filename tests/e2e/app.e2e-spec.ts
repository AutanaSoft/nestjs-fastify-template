import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/app/info (GET)', () => {
    return request(app.getHttpServer())
      .get('/app/info')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('version');
      });
  });

  it('/app/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/app/health')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('version');
        expect(res.body).toHaveProperty('database');
      });
  });

  it('should add x-correlation-id header to response', () => {
    return request(app.getHttpServer())
      .get('/app/info')
      .expect(200)
      .expect(res => {
        expect(res.headers['x-correlation-id']).toBeDefined();
        expect(typeof res.headers['x-correlation-id']).toBe('string');
      });
  });

  it('should use provided x-correlation-id', () => {
    const correlationId = 'test-correlation-id-123';
    return request(app.getHttpServer())
      .get('/app/info')
      .set('x-correlation-id', correlationId)
      .expect(200)
      .expect(res => {
        expect(res.headers['x-correlation-id']).toBe(correlationId);
      });
  });
});

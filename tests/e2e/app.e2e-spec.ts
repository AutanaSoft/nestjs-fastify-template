import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface AppInfoData {
  getAppInfo: {
    name: string;
    version: string;
    message: string;
  };
}

interface HealthData {
  getHealth: {
    status: string;
    name: string;
    version: string;
    database: {
      status: string;
    };
  };
}

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual('Hello World');
  });

  it('should test GraphQL appInfo query', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `
          query {
            getAppInfo {
              name
              version
              message
            }
          }
        `,
      },
    });

    expect(result.statusCode).toEqual(200);
    const payload: GraphQLResponse<AppInfoData> = result.json();
    expect(payload.data).toBeDefined();
    expect(payload.data?.getAppInfo).toHaveProperty('name');
    expect(payload.data?.getAppInfo).toHaveProperty('version');
    expect(payload.data?.getAppInfo).toHaveProperty('message');
  });

  it('should test GraphQL health query', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `
          query {
            getHealth {
              status
              name
              version
              database {
                status
              }
            }
          }
        `,
      },
    });

    expect(result.statusCode).toEqual(200);
    const payload: GraphQLResponse<HealthData> = result.json();
    expect(payload.data).toBeDefined();
    expect(payload.data?.getHealth).toHaveProperty('status');
    expect(payload.data?.getHealth).toHaveProperty('name');
    expect(payload.data?.getHealth).toHaveProperty('version');
    expect(payload.data?.getHealth).toHaveProperty('database');
  });
});

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'node:http';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      useFactory: () => {
        return {
          pinoHttp: {
            level: 'debug',
            transport: {
              targets: [
                {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    levelFirst: true,
                    //ignore: 'pid,hostname',
                    messageFormat: '[{context}] {msg}',
                  },
                },
              ],
            },
            customAttributeKeys: {
              req: 'request',
              res: 'response',
              err: 'error',
              responseTime: 'timeTaken',
            },
            genReqId: (req) => {
              return req.headers['x-correlation-id'] || crypto.randomUUID();
            },
            timestamp: () => `,"time":"${new Date().toISOString()}"`,
            customProps: (req: IncomingMessage) => {
              return {
                context: req.url || 'http',
              };
            },
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

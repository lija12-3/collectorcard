import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import * as express from 'express';

let cachedServer: any;

async function createNestServer() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.use(eventContext());
    nestApp.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    await nestApp.init();
    cachedServer = createServer(expressApp);
  }
  return cachedServer;
}

export const lambdaHandler = async (event: any, context: any) => {
  const server = await createNestServer();
  return proxy(server, event, context, 'PROMISE').promise;
};

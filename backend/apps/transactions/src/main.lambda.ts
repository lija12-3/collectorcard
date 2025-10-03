import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { PaymentServiceModule } from './payment-service.module';
import { ValidationPipe } from '@nestjs/common';
import { Handler, Context, Callback } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import * as express from 'express';

let cachedServer: any;

async function createExpressApp(): Promise<express.Express> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      PaymentServiceModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.use(eventContext());
    nestApp.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    nestApp.enableCors();
    await nestApp.init();
    cachedServer = createServer(expressApp);
  }
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  const server = await createExpressApp();
  return proxy(server, event, context, 'PROMISE').promise;
};

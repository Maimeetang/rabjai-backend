import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as express from 'express';

const server = express.default ? express.default() : (express as any)();
let isInitialized = false;

export const bootstrap = async () => {
  if (!isInitialized) {
    server.use(
      express.json({
        verify: (req: any, _res, buf) => {
          req.rawBody = buf;
        },
      }),
    );

    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { bodyParser: false },
    );

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    await app.init();
    isInitialized = true;
  }
  return server;
};

const isVercel = Boolean(
  process.env.VERCEL || process.env.VERCEL_ENV || process.env.NOW_REGION,
);

if (!isVercel) {
  bootstrap().then((app) => app.listen(process.env.PORT ?? 3000));
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  return server(req, res);
}

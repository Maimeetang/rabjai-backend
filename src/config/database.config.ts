import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as pg from 'pg';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  driver: pg,
  url: configService.getOrThrow<string>('DATABASE_URL'),

  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV === 'development',

  ssl: {
    rejectUnauthorized: false,
  },
});

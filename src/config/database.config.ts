import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),

  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV === 'development',

  ssl: {
    rejectUnauthorized: false,
  },
});

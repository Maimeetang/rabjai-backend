import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { UserModule } from '../user/user.module.js';
import { LineStrategy } from './strategies/line.strategy.js';
import { LineAuthService } from './line-auth.service.js';
import { RegistrationModule } from '../registration/registration.module.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    PassportModule,
    RegistrationModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LineAuthService, JwtStrategy, LineStrategy],
  exports: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity.js';
import { AccountService } from './account.service.js';
import { AccountMemberModule } from '@/account_member/account-member.module.js';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy.js';
import { AccountController } from './account.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), AccountMemberModule],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy],
  exports: [AccountService],
})
export class AccountModule {}

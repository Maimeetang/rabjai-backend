import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountMember } from './entities/account-member.entity.js';
import { AccountMemberService } from './account-member.service.js';
import { AccountMemberController } from './account-member.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([AccountMember])],
  controllers: [AccountMemberController],
  providers: [AccountMemberService],
  exports: [AccountMemberService],
})
export class AccountMemberModule {}

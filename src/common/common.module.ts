import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization/authorization.service.js';
import { AccountMemberModule } from '@/account_member/account-member.module.js';
import { CategoryModule } from '@/category/category.module.js';

@Module({
  imports: [AccountMemberModule, CategoryModule],
  providers: [AuthorizationService],
  exports: [AuthorizationService],
})
export class CommonModule {}

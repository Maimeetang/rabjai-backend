import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service.js';
import { UserModule } from '../user/user.module.js';
import { AccountModule } from '../account/account.module.js';
import { AccountMemberModule } from '../account_member/account-member.module.js';
import { CategoryModule } from '../category/category.module.js';

@Module({
  imports: [UserModule, AccountModule, AccountMemberModule, CategoryModule],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}

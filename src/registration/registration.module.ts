import { AccountModule } from '@/account/account.module.js';
import { AccountMemberModule } from '@/account_member/account-member.module.js';
import { UserModule } from '@/user/user.module.js';
import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service.js';

@Module({
  imports: [UserModule, AccountModule, AccountMemberModule],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}

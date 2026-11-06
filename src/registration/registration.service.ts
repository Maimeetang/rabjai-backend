import { Account } from '@/account/entities/account.entity.js';
import { AccountType } from '@/account/enums/account-type.enum.js';
import { AccountMember } from '@/account_member/entities/account-member.entity.js';
import { MemberRole } from '@/account_member/enums/member-role.enum.js';
import { User } from '@/user/entities/user.entity.js';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class RegistrationService {
  constructor(private readonly dataSource: DataSource) {}

  async register(
    lineUserId: string,
    lineName: string,
    linePictureUrl?: string,
  ): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const accountRepository = manager.getRepository(Account);
      const memberRepository = manager.getRepository(AccountMember);

      const user = await userRepository.save({
        id: lineUserId,
        name: lineName,
        pictureUrl: linePictureUrl,
        role: 'GUEST',
      });

      const account = await accountRepository.save({
        type: AccountType.PERSONAL,
      });

      await memberRepository.save({
        accountId: account.id,
        userId: user.id,
        role: MemberRole.OWNER,
      });

      return user;
    });
  }
}

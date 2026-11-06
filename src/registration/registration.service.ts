import { AccountService } from '@/account/account.service.js';
import { AccountType } from '@/account/enums/account-type.enum.js';
import { AccountMemberService } from '@/account_member/account-member.service.js';
import { MemberType } from '@/account_member/enums/member-role.enum.js';
import { User } from '@/user/entities/user.entity.js';
import { UserService } from '@/user/user.service.js';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly memberService: AccountMemberService,
  ) {}

  async register(
    lineUserId: string,
    lineName: string,
    linePictureUrl?: string,
  ): Promise<User> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const user = await this.userService.create(
        lineUserId,
        lineName,
        linePictureUrl,
        transactionalEntityManager,
      );

      const account = await this.accountService.create(
        AccountType.PERSONAL,
        transactionalEntityManager,
      );

      await this.memberService.create(
        account.id,
        user.id,
        MemberType.OWNER,
        transactionalEntityManager,
      );

      return user;
    });
  }
}

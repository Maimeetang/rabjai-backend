import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from './entities/account.entity.js';
import { DataSource } from 'typeorm';
import { AccountMemberService } from '@/account_member/account-member.service.js';
import { AccountMember } from '@/account_member/entities/account-member.entity.js';

@Injectable()
export class AccountService {
  constructor(
    private dataSource: DataSource,
    private readonly accountMemberService: AccountMemberService,
  ) {}

  async findBelongsToUser(userId: string): Promise<Account[]> {
    return (await this.accountMemberService.findByUserId(userId)).map(
      (membership) => membership.account,
    );
  }

  async findOne(accountId: number, userId: string): Promise<Account> {
    const membership = await this.accountMemberService.findByAccountAndUser(
      accountId,
      userId,
    );

    if (!membership) {
      throw new NotFoundException(`Account with ID: ${accountId} not found`);
    }

    return membership.account;
  }

  async ensurePersonalAccount(userId: string): Promise<Account> {
    return await this.dataSource.transaction(async (manager) => {
      const accountRepository = manager.getRepository(Account);
      const memberRepository = manager.getRepository(AccountMember);

      // Check existing personal account
      const existingMembership = await memberRepository.findOne({
        where: {
          userId,
          role: 'OWNER',
          account: {
            type: 'PERSONAL',
          },
        },
        relations: {
          account: true,
        },
      });

      if (existingMembership) {
        return existingMembership.account;
      }

      // Create personal account
      const account = await accountRepository.save(
        accountRepository.create({
          type: 'PERSONAL',
        }),
      );

      // Add owner as account member
      await memberRepository.save(
        memberRepository.create({
          accountId: account.id,
          userId,
          role: 'OWNER',
        }),
      );

      return account;
    });
  }
}

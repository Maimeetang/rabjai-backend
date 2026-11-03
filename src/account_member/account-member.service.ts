import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AccountMember } from './entities/account-member.entity.js';

@Injectable()
export class AccountMemberService {
  constructor(
    @InjectRepository(AccountMember)
    private readonly accountMemberRepository: Repository<AccountMember>,
  ) {}

  async findByAccountId(accountId: number): Promise<AccountMember[]> {
    return this.accountMemberRepository.find({
      where: { accountId },
      relations: { user: true },
    });
  }

  async findByUserId(userId: number): Promise<AccountMember[]> {
    return this.accountMemberRepository.find({
      where: { userId },
      relations: { account: true },
    });
  }

  async findByAccountAndUser(
    accountId: number,
    userId: number,
  ): Promise<AccountMember> {
    const membership = await this.accountMemberRepository.findOne({
      where: { accountId, userId },
    });

    if (!membership) {
      throw new NotFoundException(
        `User ${userId} is not a member of account ${accountId}`,
      );
    }

    return membership;
  }

  async isMember(accountId: number, userId: number): Promise<boolean> {
    return this.accountMemberRepository.exists({
      where: { accountId, userId },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AccountMember } from './entities/account-member.entity.js';
import { MemberRole } from './enums/member-role.enum.js';

@Injectable()
export class AccountMemberService {
  constructor(
    @InjectRepository(AccountMember)
    private readonly accountMemberRepository: Repository<AccountMember>,
  ) {}

  async create(
    accountId: number,
    userId: string,
    role: MemberRole,
  ): Promise<AccountMember> {
    return this.accountMemberRepository.save({
      accountId: accountId,
      userId: userId,
      role: role,
    });
  }

  async findByAccountId(accountId: number): Promise<AccountMember[]> {
    return this.accountMemberRepository.find({
      where: { accountId },
      relations: { user: true },
    });
  }

  async findByUserId(userId: string): Promise<AccountMember[]> {
    return this.accountMemberRepository.find({
      where: { userId },
      relations: { account: true },
    });
  }

  async findByAccountIdAndUserId(
    accountId: number,
    userId: string,
  ): Promise<AccountMember> {
    const membership = await this.accountMemberRepository.findOne({
      where: { accountId, userId },
      relations: { account: true },
    });

    if (!membership) {
      throw new NotFoundException(
        `User ${userId} is not a member of account ${accountId}`,
      );
    }

    return membership;
  }

  async isMember(accountId: number, userId: string): Promise<boolean> {
    return this.accountMemberRepository.exists({
      where: { accountId, userId },
    });
  }

  async addOwner(
    accountId: number,
    userId: string,
    manager: EntityManager,
  ): Promise<AccountMember> {
    return manager.getRepository(AccountMember).save({
      accountId,
      userId,
      role: MemberRole.OWNER,
    });
  }

  async isOwner(accountId: number, userId: string): Promise<boolean> {
    return this.accountMemberRepository.exists({
      where: {
        accountId,
        userId,
        role: MemberRole.OWNER,
      },
    });
  }
}

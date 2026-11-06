import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AccountMember } from './entities/account-member.entity.js';
import { MemberType } from './enums/member-role.enum.js';

@Injectable()
export class AccountMemberService {
  constructor(
    @InjectRepository(AccountMember)
    private readonly accountMemberRepository: Repository<AccountMember>,
  ) {}

  async create(
    accountId: number,
    userId: string,
    role: MemberType,
    transactionalEntityManager?: EntityManager,
  ): Promise<AccountMember> {
    const repository = transactionalEntityManager
      ? transactionalEntityManager.getRepository(AccountMember)
      : this.accountMemberRepository;

    const member = repository.create({
      accountId: accountId,
      userId: userId,
      role: role,
    });

    return this.accountMemberRepository.save(member);
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
}

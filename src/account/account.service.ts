import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from './entities/account.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AccountType } from './enums/account-type.enum.js';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async findById(id: number): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { id } });

    if (!account) {
      throw new NotFoundException(`Account with ID: ${id} not found`);
    }

    return account;
  }

  async createPersonalAccount(manager: EntityManager): Promise<Account> {
    return manager.getRepository(Account).save({
      type: AccountType.PERSONAL,
    });
  }
}

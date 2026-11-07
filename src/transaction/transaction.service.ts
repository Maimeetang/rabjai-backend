import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '@/category/category.service.js';
import { AccountMemberService } from '@/account_member/account-member.service.js';
import { MemberRole } from '@/account_member/enums/member-role.enum.js';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountMemberService: AccountMemberService,
    private categoryService: CategoryService,
  ) {}

  async create(
    userId: string,
    categoryId: number,
    amount: string,
    description: string,
    transactionDate: Date,
  ): Promise<Transaction> {
    const category = await this.categoryService.findOne(categoryId, true);

    if (!category) {
      throw new NotFoundException('The specified category does not exist.');
    }

    if (!category.accountId) {
      throw new BadRequestException(
        'This category is not linked to any account.',
      );
    }

    const membership = await this.accountMemberService.findByAccountIdAndUserId(
      category.accountId,
      userId,
    );

    if (!membership || membership.role !== MemberRole.OWNER) {
      throw new ForbiddenException(
        'Only account owners can create transactions.',
      );
    }

    return this.transactionRepository.save({
      accountId: category.accountId,
      userId: userId,
      amount: amount,
      description: description,
      transactionDate: transactionDate,
    });
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { AuthorizationService } from '@/common/authorization/authorization.service.js';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async findOne(
    id: number,
    options?: {
      user?: boolean;
      account?: boolean;
      category?: boolean;
    },
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: {
        user: options?.user ?? false,
        account: options?.account ?? false,
        category: options?.category ?? false,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }

    return transaction;
  }

  async create(
    categoryId: number,
    userId: string,
    transactionData: CreateTransactionDto,
  ): Promise<Transaction> {
    const category = await this.authorizationService.verifyCategory(categoryId);

    const accountId = category.accountId;
    await this.authorizationService.verifyAccountOwner(accountId, userId);

    const payload = {
      ...transactionData,
      categoryId,
      accountId,
      userId,
    };

    const transaction = this.transactionRepository.create(payload);
    return this.transactionRepository.save(transaction);
  }

  async update(
    userId: string,
    id: number,
    transactionData: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id, { account: true });
    await this.authorizationService.verifyAccountOwner(
      transaction.accountId,
      userId,
    );

    if (transactionData.categoryId !== undefined) {
      const category = await this.authorizationService.verifyCategory(
        transactionData.categoryId,
      );

      if (category.accountId !== transaction.accountId) {
        throw new BadRequestException('Invalid category');
      }
    }

    await this.transactionRepository.update(id, {
      ...transactionData,
    });
    return await this.findOne(id);
  }

  async findBelongToAccount(
    accountId: number,
    userId: string,
    startDate: string,
    endDate: string,
  ) {
    await this.authorizationService.verifyAccountOwner(accountId, userId);

    return this.transactionRepository.find({
      where: {
        accountId,
        transactionDate: Between(
          new Date(`${startDate}T00:00:00`),
          new Date(`${endDate}T23:59:59.999`),
        ),
      },
      relations: {
        category: true,
      },
      order: {
        transactionDate: 'DESC',
      },
    });
  }

  async delete(id: number, userId: string): Promise<Transaction> {
    const transaction = await this.findOne(id, {
      account: true,
      category: true,
    });

    await this.authorizationService.verifyAccountOwner(
      transaction.accountId,
      userId,
    );

    await this.transactionRepository.delete(id);

    return transaction;
  }
}

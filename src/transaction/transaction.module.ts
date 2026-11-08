import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity.js';
import { TransactionService } from './transaction.service.js';
import { TransactionController } from './transaction.controller.js';
import { CategoryModule } from '@/category/category.module.js';
import { AccountMemberModule } from '@/account_member/account-member.module.js';
import { CommonModule } from '@/common/common.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    AccountMemberModule,
    CategoryModule,
    CommonModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}

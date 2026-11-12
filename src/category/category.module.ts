import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity.js';
import { CategoryService } from './category.service.js';
import { AccountMemberModule } from '../account_member/account-member.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AccountMemberModule],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}

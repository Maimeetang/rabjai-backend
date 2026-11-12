import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AccountMemberService } from '../../account_member/account-member.service.js';
import { MemberRole } from '../enums/member-role.enum.js';
import { CategoryService } from '../../category/category.service.js';
import { Category } from '../../category/entities/category.entity.js';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly accountMemberService: AccountMemberService,
    private readonly categoryService: CategoryService,
  ) {}

  async verifyAccountOwner(accountId: number, userId: string): Promise<void> {
    const membership = await this.accountMemberService.findByAccountIdAndUserId(
      accountId,
      userId,
    );

    if (!membership || membership.role !== MemberRole.OWNER) {
      throw new ForbiddenException(
        'Only account owners can perform this action.',
      );
    }
  }

  async verifyCategory(
    categoryId: number,
  ): Promise<Category & { accountId: number }> {
    const category = await this.categoryService.findOne(categoryId, true);

    if (!category || !category.accountId) {
      throw new BadRequestException('Invalid category');
    }

    return category as Category & { accountId: number };
  }
}

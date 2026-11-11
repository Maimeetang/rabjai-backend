import { ForbiddenException, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountMemberService } from '@/account_member/account-member.service.js';
import { CategoryType } from './enums/category-type.enum.js';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly accountMemberService: AccountMemberService,
  ) {}

  async seedDefaultCategories(
    accountId: number,
    manager: EntityManager,
  ): Promise<Category[]> {
    return manager.getRepository(Category).save([
      { accountId, name: 'ค่าอาหาร', type: CategoryType.EXPENSE },
      { accountId, name: 'ค่าเดินทาง', type: CategoryType.EXPENSE },
      { accountId, name: 'ค่าที่พัก', type: CategoryType.EXPENSE },
      {
        accountId,
        name: 'อื่น ๆ',
        type: CategoryType.EXPENSE,
        isFallback: true,
      },
      { accountId, name: 'เงินเดือน', type: CategoryType.INCOME },
      {
        accountId,
        name: 'อื่น ๆ',
        type: CategoryType.INCOME,
        isFallback: true,
      },
    ]);
  }

  async create(
    userId: string,
    accountId: number,
    name: string,
    type: CategoryType,
  ): Promise<Category> {
    const isOwner = await this.accountMemberService.isOwner(accountId, userId);

    if (!isOwner) {
      throw new ForbiddenException('Only account owner can manage categories');
    }

    return this.categoryRepository.save({
      accountId: accountId,
      name: name,
      type: type,
    });
  }

  async findOne(id: number, withAccountRelation = false) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: { account: withAccountRelation },
    });
  }

  async findByAccountId(accountId: number): Promise<Category[]> {
    return this.categoryRepository.find({
      where: [{ accountId }],
      order: {
        id: 'ASC',
      },
    });
  }

  editName() {}

  delete() {}
}

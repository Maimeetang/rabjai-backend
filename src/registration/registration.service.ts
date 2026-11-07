import { AccountService } from '@/account/account.service.js';
import { AccountMemberService } from '@/account_member/account-member.service.js';
import { CategoryService } from '@/category/category.service.js';
import { User } from '@/user/entities/user.entity.js';
import { UserService } from '@/user/user.service.js';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly accountMemberService: AccountMemberService,
    private readonly categoryService: CategoryService,
  ) {}

  async register(
    lineUserId: string,
    lineName: string,
    linePictureUrl?: string,
  ): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const user = await this.userService.createUser(
        {
          id: lineUserId,
          name: lineName,
          pictureUrl: linePictureUrl,
        },
        manager,
      );
      const account = await this.accountService.createPersonalAccount(manager);
      await this.accountMemberService.addOwner(account.id, user.id, manager);
      await this.categoryService.seedDefaultCategories(account.id, manager);
      return user;
    });
  }
}

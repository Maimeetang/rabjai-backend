import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    accountId: number,
    name: string,
    type: string,
  ): Promise<Category> {
    return this.categoryRepository.save({
      accountId: accountId,
      name: name,
      type: type,
    });
  }

  editName() {}

  delete() {}
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByLineUserId(lineUserId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { lineUserId },
    });
  }

  async create(data: { lineUserId: string }): Promise<User> {
    const user = this.userRepository.create({
      lineUserId: data.lineUserId,
      role: 'GUEST',
    });

    return this.userRepository.save(user);
  }
}

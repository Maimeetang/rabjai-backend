import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(
    lineUserId: string,
    lineName: string,
    linePictureUrl: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      lineUserId: lineUserId,
      name: lineName,
      pictureUrl: linePictureUrl,
      role: 'GUEST',
    });

    return this.userRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }

    return user;
  }
}

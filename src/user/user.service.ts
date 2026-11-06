import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async create(
    lineUserId: string,
    lineName: string,
    linePictureUrl?: string,
    transactionalEntityManager?: EntityManager,
  ): Promise<User> {
    const repository = transactionalEntityManager
      ? transactionalEntityManager.getRepository(User)
      : this.userRepository;

    const user = repository.create({
      id: lineUserId,
      name: lineName,
      pictureUrl: linePictureUrl,
      role: 'GUEST',
    });

    return this.userRepository.save(user);
  }
}

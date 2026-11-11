import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { AccountType } from '../../common/enums/account-type.enum.js';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 20,
  })
  type: AccountType;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt: Date;
}

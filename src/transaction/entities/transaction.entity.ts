import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Account } from '../../account/entities/account.entity.js';
import { User } from '../../user/entities/user.entity.js';
import { Category } from '../../category/entities/category.entity.js';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'account_id',
    type: 'integer',
    nullable: false,
  })
  accountId: number;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'category_id',
    type: 'integer',
    nullable: false,
  })
  categoryId: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  amount: string;

  @Column({
    type: 'text',
    default: '',
    nullable: false,
  })
  description: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  updatedAt: Date;

  @Column({
    name: 'transaction_date',
    type: 'date',
    default: () => 'now()',
    nullable: false,
  })
  transactionDate: Date;

  // Relations
  @ManyToOne(() => Account)
  @JoinColumn({
    name: 'account_id',
    foreignKeyConstraintName: 'fk_transactions_account',
  })
  account: Account;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_transactions_user',
  })
  user: User;

  @ManyToOne(() => Category)
  @JoinColumn({
    name: 'category_id',
  })
  category: Category;
}

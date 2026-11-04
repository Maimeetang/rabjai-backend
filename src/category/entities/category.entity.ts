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

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'account_id',
    type: 'integer',
    nullable: true,
  })
  accountId: number | null;

  @Column({
    type: 'text',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  type: string;

  @Column({
    name: 'is_fallback',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isFallback: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'now()',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'now()',
    nullable: false,
  })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Account, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({
    name: 'account_id',
    foreignKeyConstraintName: 'fk_categories_account',
  })
  account: Account | null;
}

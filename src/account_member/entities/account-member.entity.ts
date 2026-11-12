import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Account } from '../../account/entities/account.entity.js';
import { User } from '../../user/entities/user.entity.js';
import { MemberRole } from '../../common/enums/member-role.enum.js';

@Entity('account_members')
@Index('uq_account_member', ['accountId', 'userId'], {
  unique: true,
})
export class AccountMember {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'account_id',
    type: 'int',
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
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  role: MemberRole;

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

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'account_id',
    foreignKeyConstraintName: 'fk_account_members_account',
  })
  account: Account;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_account_members_user',
  })
  user: User;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'line_uid',
    unique: true,
    length: 50,
  })
  lineUserId: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'USER',
  })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

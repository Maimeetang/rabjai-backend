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
    nullable: false,
  })
  lineUserId: string;

  @Column({
    name: 'name',
    length: 50,
  })
  name: string;

  @Column({
    name: 'picture_url',
    length: 255,
  })
  pictureUrl: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'GUEST',
    nullable: false,
  })
  role: string;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;
}

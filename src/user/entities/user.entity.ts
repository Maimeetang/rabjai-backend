import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({
    type: 'varchar',
    length: 50,
  })
  id: string;

  @Column({
    name: 'name',
    length: 50,
  })
  name: string;

  @Column({
    name: 'picture_url',
    length: 255,
    nullable: true,
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

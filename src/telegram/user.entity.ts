import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('user_bindings')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({type: 'bigint'})
  telegramUserId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  telegramUserName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  wunderlistToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}

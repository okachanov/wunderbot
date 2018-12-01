import { Column, Entity, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({type: 'bigint'})
  telegramUserId: number;

  @Index()
  @Column({type: 'bigint', nullable: true})
  telegramChatId: number;

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
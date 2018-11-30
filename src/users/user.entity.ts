import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  wunderlistApiKey: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  telegramChatId: string;

}
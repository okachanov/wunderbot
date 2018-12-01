import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

Injectable();
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
  }

  async findByFilter(filter: object, params = {}): Promise<User[]> {
    return await this.usersRepository.find({
      where: filter,
      ...params,
    });
  }

  async findOneByFilter(filter: object, params = {}): Promise<User> {
    return this.usersRepository.findOne({
      where: filter,
      ...params,
    });
  }

  async saveUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async deleteUser(user: User): Promise<any> {
    return this.usersRepository.remove(user);
  }

  async findUserByTelegramChatId(telegramChatId: string){
    return this.findOneByFilter( { telegramChatId });
  }

  async findUserByWunderlistApiKey(wunderlistApiKey: string){
    return this.findOneByFilter( { wunderlistApiKey });
  }

  async getUserByTelegramUserId(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({telegramUserId: userId});
    if (user){
      return user;
    }else {
      const newUser = new User();
      newUser.telegramUserId = userId;
      return this.usersRepository.save(newUser);
    }
  }
}

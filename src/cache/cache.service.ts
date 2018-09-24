import * as redis from 'redis';
import * as stow from 'stow';
import * as RedisBackend from 'stow/backends/redis';
import * as MemoryBackend from 'stow/backends/memory';

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class CacheService implements OnModuleInit {

  private readonly cacheService = null;

  constructor(@Inject('ConfigProvider') config){
    if (config.get(`cache.enabled`)){

      const cacheEngine = config.get(`cache.engine`);

      if (cacheEngine === 'redis'){
        this.cacheService = stow.createCache(RedisBackend, {
          client: redis.createClient(),
        });
      }else if (cacheEngine === 'memory'){
        this.cacheService = stow.createCache(MemoryBackend, {});
      }

    }
  }

  onModuleInit(){
    if (this.cacheService){
      Logger.log('Cache service ready', 'CacheService');
    }
  }

  async get(key: string){
    key = `cache_` + key;
    if (this.cacheService){
      return new Promise((resolve, reject) => {
        this.cacheService.get(key, (err, result) => {
          if (err) reject(err);
          else{
            if (result) resolve(result.data ? result.data : null);
            else resolve(null);
          }
        });
      });
    }else return Promise.resolve(null);
  }

  async set(key: string, data: any, ttl: number = 60, tagsArr: any = []){

    key = `cache_` + key;
    const tags = {tags: tagsArr};

    if (this.cacheService){
      return new Promise((resolve, reject) => {
        this.cacheService.set(
          {key, data, ttl, tags},
          (err) => {
            if (err) reject(err);
            else resolve(true);
          });
      });
    }else return Promise.resolve(null);
  }

  async delete(tagsArr){

    const tags = {tags: tagsArr};

    if (this.cacheService){
      return new Promise((resolve, reject) => {
        this.cacheService.invalidate(
          tags,
          (err) => {
            if (err) reject(err);
            else resolve(true);
          });
      });
    }else return Promise.resolve(null);
  }
}

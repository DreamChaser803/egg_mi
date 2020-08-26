'use strict';

const Service = require('egg').Service;

class CacheService extends Service {

    // 存redis值
    async set(key, value, seconds) {

        value = JSON.stringify(value);
        if (this.app.redis) {
            if(!seconds){
                await this.app.redis.set(key,value)
            }else{
                await this.app.redis.set(key,value,"EX",seconds)
            }
        }

    }

    // 取redis值
    async get(key) {
         if(this.app.redis){
             let data = await this.app.redis.get(key);
             if(!data){
                return 
             }else{
                 return JSON.parse(data)
             }
         }
    }
}

module.exports = CacheService;

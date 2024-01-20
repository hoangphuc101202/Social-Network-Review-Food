const Redis = require("ioredis");
const redisConfig = require('../config/redis.config');
const redis = new Redis({
  port: redisConfig.REDIS_PORT,
  host: redisConfig.REDIS_HOST
});
module.exports = {
    set : (key, value) => {
        return redis.set(key, value)
    },
    get: (key) => {
        return redis.get(key);
    },
    getTTL : (key) => {
        return redis.ttl(key);
    },
    setTimeInSecond : (key, value, timeInSecond) => {
        return redis.set(key, value, 'EX', timeInSecond)
    }, 
    del :(key)  => {
        return redis.del(key);
    }
}
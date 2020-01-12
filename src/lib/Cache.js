import Redis from 'ioredis';

class Cache {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });
  }

  set(key, value) {
    // Redis não aceita array, objetos, etc.. sempre stringify
    // EX: para expirar o cache na quantidade de tempo em segundos
    // 86400 = segundos em 24 horas (60 * 60 * 24)
    return this.redis.set(key, JSON.stringify(value), 'EX', 86400);
  }

  async get(key) {
    const cached = await this.redis.get(key);

    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    return this.redis.del(key);
  }

  async invalidatePrefix(prefix) {
    const keys = await this.redis.keys(`cache:${prefix}:*`);

    const keysWithoutPrefix = keys.map(key => key.replace('cache:', ''));

    return this.redis.del(keysWithoutPrefix);
  }
}

export default new Cache();

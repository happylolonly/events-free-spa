import mongoose from 'mongoose';
import redis from 'redis';

import util from 'util';
import config from '../configs';

const client = redis.createClient(config.redis.uri, { no_ready_check: true });

client.on('connect', () => {
  console.log('Connected to Redis');

  client.FLUSHDB(() => {
    console.log('cleared');
  });

  client.keys('*', (err, keys) => {
    console.log('Redis cache length: ', keys.length);
  });
});

client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');

  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  const cacheValue = await client.hget(this.hashKey, key);

  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result));
  client.expire(this.hashKey, 60 * 60); // 1 hour

  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};

import mongoose from 'mongoose';
import redis from 'redis';

import util from 'util';
import config from '../configs';

// const client = redis.createClient(config.redis);

var client = redis.createClient('15117', config.redis, {no_ready_check: true});
client.auth('SsuWlN1ScMpgFDt5QKQHU2vUHY1VoTP8', function (err) {
    if (err) throw err;
});

client.on('connect', function() {
    console.log('Connected to Redis');
});


client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
}

mongoose.Query.prototype.exec = async function() {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        
        collection: this.mongooseCollection.name
    }));
    
    const cacheValue = await client.hget(this.hashKey, key);
    // debugger;

    if (cacheValue) {
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc) ?
            doc.map(d => new this.model(d)) :
            new this.model(doc);
    }

    const result = await exec.apply(this, arguments);
    // debugger;

    client.hset(this.hashKey, key, JSON.stringify(result));

    return result;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};
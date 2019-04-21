// This code monkey patchs the Mongoose library

const mongoose = require('mongoose');
const redis = require('redis');
// util is included in node
const util = require('util');
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);
// promisify takes a function and takes its callback as the last argument
// and returns a promise instead.
// now we don't have to return a callback
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;
// options specifies the top level hash key
mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  // any key we use must be a number or a string
  // if someone does not pass a key use empty string
  this.hashKey = JSON.stringify(options.key || '');

  return this;
};

// Overight the exec function and add some additional logic
// Don't use a arrow function beacuse we want "this" to reference Query
mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    // Run the original exec function
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    // Safely copy properties from one object to another
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  // See if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, key);

  // If we do, return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    // The exec function is expected to return a Mongoose model
    // which has functions like get, set, validate, isModified etc
    // dealing with array of records. If doc is an array returns true

    return Array.isArray(doc)
      ? // this.model creates new model instance e.g new Blog({ title: 'Hi', content: 'There})
        doc.map(d => new this.model(d))
      : // dealing with a single record
        new this.model(doc);
  }

  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};

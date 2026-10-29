
const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL: 300,           
  checkperiod: 60,      
  useClones: false       
});

/**
 * Get data from cache or execute callback
 * @param {string} key - Cache key
 * @param {function} callback - Async function to execute if cache miss
 * @param {number} ttl - Optional custom TTL in seconds
 * @returns {Promise<any>}
 */
const getOrSet = async (key, callback, ttl = 300) => {
  const cached = cache.get(key);
  
  if (cached !== undefined) {
    return cached;
  }
  
  const result = await callback();
  
  cache.set(key, result, ttl);
  
  return result;
};


const clear = (key) => {
  cache.del(key);
};


const clearAll = () => {
  cache.flushAll();

};

const getStats = () => {
  return cache.getStats();
};

module.exports = {
  cache,
  getOrSet,
  clear,
  clearAll,
  getStats
};


const { getRedisClient, isRedisReady } = require("./redisClient");


function cacheMiddleware(keyPrefix, ttlSeconds = 30) {
  return async (req, res, next) => {
    if (!isRedisReady()) return next();

    const cacheKey = `${keyPrefix}:${req.originalUrl}`;

    try {
      const redis = await getRedisClient();
      if (!redis) return next();

      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return res.json(parsed);
      }


      const originalJson = res.json.bind(res);
      res.json = (data) => {
        redis.setEx(cacheKey, ttlSeconds, JSON.stringify(data)).catch(() => { });
        return originalJson(data);
      };

      next();
    } catch (err) {

      next();
    }
  };
}


async function invalidateCache(keyPrefix) {
  if (!isRedisReady()) return;

  try {
    const redis = await getRedisClient();
    if (!redis) return;


    let cursor = 0;
    do {
      const result = await redis.scan(cursor, { MATCH: `${keyPrefix}:*`, COUNT: 100 });
      cursor = result.cursor;
      if (result.keys.length > 0) {
        await redis.del(result.keys);
      }
    } while (cursor !== 0);
  } catch (err) {

    console.warn(" Cache invalidation failed:", err.message);
  }
}

module.exports = { cacheMiddleware, invalidateCache };

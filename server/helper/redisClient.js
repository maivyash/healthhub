/**
 * redisClient.js
 * Singleton Redis client with graceful fallback.
 * If Redis is unavailable, the app continues without caching.
 */
const { createClient } = require("redis");

let client = null;
let isReady = false;

async function getRedisClient() {
  if (client && isReady) return client;
  if (client) return null; // Connection attempted but failed

  try {
    client = createClient({
      url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
      socket: {
        connectTimeout: 3000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.warn("⚠️ Redis: max reconnect attempts reached, running without cache");
            return false; // Stop reconnecting
          }
          return Math.min(retries * 500, 2000);
        },
      },
    });

    client.on("error", (err) => {
      if (isReady) {
        console.warn("⚠️ Redis connection lost:", err.message);
        isReady = false;
      }
    });

    client.on("ready", () => {
      isReady = true;
      console.log("✅ Redis connected");
    });

    await client.connect();
    return client;
  } catch (err) {
    console.warn("⚠️ Redis unavailable, running without cache:", err.message);
    client = null;
    isReady = false;
    return null;
  }
}

function isRedisReady() {
  return isReady && client !== null;
}

async function closeRedis() {
  if (client) {
    try {
      await client.quit();
    } catch (err) {
      // Ignore close errors
    }
    client = null;
    isReady = false;
  }
}

module.exports = { getRedisClient, isRedisReady, closeRedis };

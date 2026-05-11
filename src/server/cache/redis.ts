import IORedis from "ioredis";

declare global {
  // Prevent multiple Redis instances in Next.js dev hot-reload
  // eslint-disable-next-line no-var
  var _redisClient: IORedis | undefined;
}

function createRedisClient(): IORedis {
  const client = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    lazyConnect: true,
    retryStrategy(times) {
      if (times > 5) return null; // Stop retrying
      return Math.min(times * 200, 2000);
    },
  });

  client.on("error", (err) => {
    console.error("[Redis] Connection error:", err.message);
  });

  client.on("connect", () => {
    console.info("[Redis] Connected.");
  });

  return client;
}

export const redis =
  globalThis._redisClient ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalThis._redisClient = redis;
}

// ── Cache Utilities ───────────────────────────────────────

const DEFAULT_TTL = 60; // seconds

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds = DEFAULT_TTL): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    // Fail silently — cache is best-effort
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch {
    // Fail silently
  }
}

// ── Named Cache Keys ──────────────────────────────────────
export const CacheKeys = {
  opportunities: (page: number, filters: string) => `opps:${page}:${filters}`,
  recommendation: (userId: string) => `recs:${userId}`,
  profile: (clerkId: string) => `profile:${clerkId}`,
  trending: () => "trending:opportunities",
};

import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/server/cache/redis";

interface RateLimitConfig {
  windowSeconds: number;
  maxRequests: number;
}

const CONFIGS: Record<string, RateLimitConfig> = {
  default:        { windowSeconds: 60,  maxRequests: 100  },
  "api/v1/ai":    { windowSeconds: 60,  maxRequests: 10   },
  "api/v1/onboarding": { windowSeconds: 60, maxRequests: 5 },
  "api/v1/bookmarks":  { windowSeconds: 60, maxRequests: 30 },
};

function getConfig(pathname: string): RateLimitConfig {
  for (const [path, config] of Object.entries(CONFIGS)) {
    if (pathname.includes(path)) return config;
  }
  return CONFIGS.default;
}

/**
 * Redis sliding-window rate limiter.
 * Returns null if allowed, or a 429 NextResponse if limit is exceeded.
 */
export async function rateLimit(
  req: NextRequest,
  identifier?: string
): Promise<NextResponse | null> {
  const ip =
    identifier ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  const config = getConfig(req.nextUrl.pathname);
  const key = `rl:${req.nextUrl.pathname}:${ip}`;
  const now = Date.now();
  const window = config.windowSeconds * 1000;

  const pipeline = redis.pipeline();
  pipeline.zadd(key, now, `${now}`);
  pipeline.zremrangebyscore(key, 0, now - window);
  pipeline.zcard(key);
  pipeline.expire(key, config.windowSeconds + 1);
  const results = await pipeline.exec();

  const count = (results?.[2]?.[1] as number) ?? 0;
  const remaining = Math.max(0, config.maxRequests - count);
  const reset = Math.floor((now + window) / 1000);

  const headers = {
    "X-RateLimit-Limit": config.maxRequests.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  };

  if (count > config.maxRequests) {
    return NextResponse.json(
      { success: false, error: "Too Many Requests" },
      { status: 429, headers }
    );
  }

  return null; // Allowed
}

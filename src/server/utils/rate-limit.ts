import { NextRequest, NextResponse } from "next/server";
import { ApiUtils } from "./api-response";

const CACHE = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(limit: number, windowMs: number) {
  return (req: NextRequest) => {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const now = Date.now();
    const record = CACHE.get(ip);

    if (!record || now > record.expiresAt) {
      CACHE.set(ip, { count: 1, expiresAt: now + windowMs });
      return null;
    }

    if (record.count >= limit) {
      return ApiUtils.error("Too many requests, please try again later.", 429);
    }

    record.count += 1;
    return null;
  };
}

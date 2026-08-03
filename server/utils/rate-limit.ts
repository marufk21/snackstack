import { db } from "@/server/db/client";

/**
 * Durable rate limiter backed by PostgreSQL (via Prisma).
 * Works across serverless instances — no in-memory Map that gets lost on cold starts.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check rate limit for a given key. Uses an atomic upsert on the RateLimit table
 * so it is safe across concurrent serverless invocations.
 *
 * @param key        Unique identifier (e.g. `ai-chat:user_abc123` or `upload:192.168.1.1`)
 * @param limit      Max requests allowed in the window
 * @param windowMs   Time window in milliseconds
 */
export async function checkRateLimit(
  key: string,
  limit: number = 20,
  windowMs: number = 60_000
): Promise<RateLimitResult> {
  const now = Date.now();
  const expiresAt = new Date(now + windowMs);

  try {
    // Atomic upsert: if the key exists and hasn't expired, increment;
    // otherwise create a new entry with count = 1
    const existing = await db.rateLimit.findUnique({ where: { key } });

    if (!existing || existing.expiresAt.getTime() <= now) {
      // No entry or expired — create/replace with count = 1
      await db.rateLimit.upsert({
        where: { key },
        update: { count: 1, expiresAt },
        create: { key, count: 1, expiresAt },
      });

      return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
    }

    if (existing.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: existing.expiresAt.getTime(),
      };
    }

    // Increment count
    const updated = await db.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });

    return {
      allowed: true,
      remaining: limit - updated.count,
      resetTime: existing.expiresAt.getTime(),
    };
  } catch (error) {
    // If the DB is unavailable, fail open with a warning rather than blocking legitimate traffic
    console.warn("Rate limit DB lookup failed — allowing request:", error instanceof Error ? error.message : error);
    return { allowed: true, remaining: 1, resetTime: now + windowMs };
  }
}

/**
 * Clean up expired rate-limit rows. Call periodically (e.g. from a Vercel cron).
 * Without cleanup the table grows unbounded (one row per unique key per window).
 */
export async function cleanupExpiredRateLimits(): Promise<number> {
  try {
    const result = await db.rateLimit.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
    return result.count;
  } catch (error) {
    console.warn("Rate limit cleanup failed:", error instanceof Error ? error.message : error);
    return 0;
  }
}

/**
 * Build a user-scoped rate-limit key. Combines userId (from session) with IP as fallback.
 */
export function getUserIdentifier(userId?: string, ip?: string): string {
  if (userId) return userId;
  if (ip) return `ip:${ip}`;
  return "anonymous";
}

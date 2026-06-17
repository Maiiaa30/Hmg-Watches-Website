import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  // The @upstash/redis REST client requires the HTTPS REST URL — not the
  // rediss:// TCP connection string. Guard against misconfiguration so a
  // wrong value disables rate limiting instead of crashing every route.
  if (!url.startsWith("https://")) {
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL must start with https:// (got a non-REST URL). Rate limiting disabled."
    );
    return null;
  }
  return new Redis({ url, token });
}

const redis = createRedis();

// Contact form: 3 submissions per 10 minutes per IP
export const contactRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "10 m"),
      prefix: "ratelimit:contact",
    })
  : null;

// Login: 5 attempts per 15 minutes per IP
export const loginRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      prefix: "ratelimit:login",
    })
  : null;

// Blog AI generation: 5 per hour per IP (cost protection)
export const blogGenerateRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "ratelimit:blog-generate",
    })
  : null;

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

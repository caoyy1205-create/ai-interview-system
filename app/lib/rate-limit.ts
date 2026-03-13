/**
 * Simple in-memory rate limiter.
 * For production, replace with Redis-backed solution (e.g. Upstash).
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();

  /**
   * Check if the key has exceeded the limit.
   * @returns true if rate limited (should block), false if allowed
   */
  check(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      // New window
      this.store.set(key, { count: 1, resetAt: now + windowMs });
      return false; // allowed
    }

    if (entry.count >= maxRequests) {
      return true; // rate limited
    }

    entry.count++;
    return false; // allowed
  }

  // Optional: cleanup expired entries to avoid memory leaks
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Run cleanup every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => rateLimiter.cleanup(), 10 * 60 * 1000);
}

// Simple in-memory rate limiter for API endpoints
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimit {
  private requests: Map<string, RateLimitEntry> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number = 10, windowMs: number = 60000) { // 10 requests per minute by default
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(identifier: string): { allowed: boolean; resetTime?: number; remaining?: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First request or window has expired
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return { allowed: true, remaining: this.limit - 1 };
    }

    if (entry.count >= this.limit) {
      // Rate limit exceeded
      return { 
        allowed: false, 
        resetTime: entry.resetTime,
        remaining: 0 
      };
    }

    // Increment count
    entry.count++;
    this.requests.set(identifier, entry);
    
    return { 
      allowed: true, 
      remaining: this.limit - entry.count 
    };
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Create a singleton instance for AI suggestions
export const aiSuggestionRateLimit = new InMemoryRateLimit(5, 60000); // 5 requests per minute

// Utility function to get user identifier for rate limiting
export function getUserIdentifier(userId: string, ip?: string): string {
  return userId || ip || 'anonymous';
}

// Cleanup expired entries every 5 minutes
setInterval(() => {
  aiSuggestionRateLimit.cleanup();
}, 5 * 60 * 1000);
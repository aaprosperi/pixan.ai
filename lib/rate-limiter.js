/**
 * Rate Limiter Middleware for API Routes
 * Implements token bucket algorithm for request throttling
 */

class RateLimiter {
  constructor(options = {}) {
    this.tokens = new Map();
    this.maxTokens = options.maxTokens || 10; // Max requests
    this.refillRate = options.refillRate || 1; // Tokens per interval
    this.refillInterval = options.refillInterval || 60000; // 1 minute default
    this.windowMs = options.windowMs || 60000; // Time window
  }

  /**
   * Get client identifier from request
   * @param {Request} req - HTTP request object
   * @returns {string} Client identifier
   */
  getClientId(req) {
    // Try to get real IP from various headers
    const forwarded = req.headers['x-forwarded-for'];
    const real = req.headers['x-real-ip'];
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : real || req.socket?.remoteAddress || 'unknown';

    // Combine IP with user agent for better uniqueness
    const userAgent = req.headers['user-agent'] || '';
    return `${ip}-${userAgent.substring(0, 50)}`;
  }

  /**
   * Check if request should be allowed
   * @param {string} clientId - Client identifier
   * @returns {Object} Result with allowed status and retry info
   */
  checkLimit(clientId) {
    const now = Date.now();
    let bucket = this.tokens.get(clientId);

    // Initialize bucket if doesn't exist
    if (!bucket) {
      bucket = {
        tokens: this.maxTokens - 1,
        lastRefill: now,
        requests: []
      };
      this.tokens.set(clientId, bucket);
      return { allowed: true, remaining: bucket.tokens, resetAt: now + this.windowMs };
    }

    // Remove old requests outside the time window
    bucket.requests = bucket.requests.filter(time => now - time < this.windowMs);

    // Refill tokens based on time passed
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(timePassed / (this.refillInterval / this.refillRate));

    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }

    // Check if we have tokens available
    if (bucket.tokens > 0) {
      bucket.tokens--;
      bucket.requests.push(now);
      this.tokens.set(clientId, bucket);

      return {
        allowed: true,
        remaining: bucket.tokens,
        resetAt: bucket.lastRefill + this.refillInterval
      };
    }

    // Rate limit exceeded
    const oldestRequest = bucket.requests[0] || now;
    const resetAt = oldestRequest + this.windowMs;

    return {
      allowed: false,
      remaining: 0,
      resetAt,
      retryAfter: Math.ceil((resetAt - now) / 1000) // seconds
    };
  }

  /**
   * Middleware function for Next.js API routes
   * @param {Object} options - Configuration options
   * @returns {Function} Middleware function
   */
  middleware(options = {}) {
    const limiter = this;

    return async (req, res, handler) => {
      const clientId = limiter.getClientId(req);
      const result = limiter.checkLimit(clientId);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', limiter.maxTokens);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', new Date(result.resetAt).toISOString());

      if (!result.allowed) {
        res.setHeader('Retry-After', result.retryAfter);
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
          retryAfter: result.retryAfter
        });
      }

      // Request allowed, continue to handler
      return handler(req, res);
    };
  }

  /**
   * Clear rate limit data for a client
   * @param {string} clientId - Client identifier
   */
  clear(clientId) {
    this.tokens.delete(clientId);
  }

  /**
   * Clear all rate limit data
   */
  clearAll() {
    this.tokens.clear();
  }

  /**
   * Get current status for a client
   * @param {string} clientId - Client identifier
   * @returns {Object} Current bucket status
   */
  getStatus(clientId) {
    return this.tokens.get(clientId) || null;
  }
}

// Pre-configured limiters for different use cases
export const apiLimiter = new RateLimiter({
  maxTokens: 20,
  refillRate: 1,
  refillInterval: 60000, // 1 minute
  windowMs: 60000
});

export const authLimiter = new RateLimiter({
  maxTokens: 5,
  refillRate: 1,
  refillInterval: 300000, // 5 minutes
  windowMs: 300000
});

export const llmLimiter = new RateLimiter({
  maxTokens: 10,
  refillRate: 1,
  refillInterval: 60000, // 1 minute
  windowMs: 60000
});

export const strictLimiter = new RateLimiter({
  maxTokens: 3,
  refillRate: 1,
  refillInterval: 600000, // 10 minutes
  windowMs: 600000
});

/**
 * Helper function to apply rate limiting to API route
 * @param {Function} handler - API route handler
 * @param {RateLimiter} limiter - Rate limiter instance
 * @returns {Function} Wrapped handler with rate limiting
 */
export function withRateLimit(handler, limiter = apiLimiter) {
  return async (req, res) => {
    return limiter.middleware()(req, res, handler);
  };
}

export default RateLimiter;

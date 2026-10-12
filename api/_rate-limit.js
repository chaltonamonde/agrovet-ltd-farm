/**
 * AGROVET LTD (agrovet.ltd) — Central In-Memory Sliding-Window Rate Limiter
 * Guards serverless endpoints against brute-force attacks, phone prompt flooding,
 * and automated spamming without requiring external Redis infrastructure.
 */

// Key => Array of timestamps (ms)
const rateLimitStore = new Map();

// Periodic cleanup every 60 seconds to evict expired records and prevent memory leaks
let lastCleanup = Date.now();
function cleanupExpired(maxAgeMs = 300000) {
  const now = Date.now();
  if (now - lastCleanup < 60000) return;
  lastCleanup = now;

  for (const [key, timestamps] of rateLimitStore.entries()) {
    const valid = timestamps.filter((t) => now - t < maxAgeMs);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, valid);
    }
  }
}

/**
 * Extracts the real client IP from incoming request headers
 */
function getClientIp(req) {
  if (!req) return '127.0.0.1';
  const headers = req.headers || {};
  const forwarded = headers['x-forwarded-for'];
  if (forwarded) {
    return String(forwarded).split(',')[0].trim();
  }
  return headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Core sliding-window rate limit checker
 * @param {Object} options
 * @param {string} options.key - Unique identifier (e.g., "stk:ip:1.2.3.4")
 * @param {number} options.limit - Maximum number of allowed hits
 * @param {number} options.windowMs - Sliding window duration in milliseconds
 * @returns {{ success: boolean, limit: number, remaining: number, resetSeconds: number, retryAfter: number }}
 */
function rateLimit({ key, limit = 10, windowMs = 60000 }) {
  cleanupExpired(windowMs);

  const now = Date.now();
  const timestamps = (rateLimitStore.get(key) || []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds: retryAfter,
      retryAfter,
    };
  }

  timestamps.push(now);
  rateLimitStore.set(key, timestamps);

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - timestamps.length),
    resetSeconds: Math.ceil(windowMs / 1000),
    retryAfter: 0,
  };
}

/**
 * Sets standard RateLimit headers on the HTTP response
 */
function setRateLimitHeaders(res, result) {
  if (!res || typeof res.setHeader !== 'function') return;
  try {
    res.setHeader('X-RateLimit-Limit', String(result.limit));
    res.setHeader('X-RateLimit-Remaining', String(result.remaining));
    res.setHeader('X-RateLimit-Reset', String(result.resetSeconds));
    if (!result.success && result.retryAfter) {
      res.setHeader('Retry-After', String(result.retryAfter));
    }
  } catch (e) {
    // Ignore header errors if headers were already sent
  }
}

/**
 * M-Pesa STK Push Guard
 * Limits:
 * - 5 STK pushes per client IP per 60s
 * - 3 STK pushes per destination phone number per 60s
 */
function checkStkRateLimit(req, phone, res) {
  const ip = getClientIp(req);
  const ipKey = `mpesa:stk:ip:${ip}`;
  const ipCheck = rateLimit({ key: ipKey, limit: 5, windowMs: 60000 });

  if (!ipCheck.success) {
    setRateLimitHeaders(res, ipCheck);
    return {
      allowed: false,
      status: 429,
      error: `Too many M-Pesa STK payment attempts from this network. Please wait ${ipCheck.retryAfter} seconds before trying again.`,
      retryAfter: ipCheck.retryAfter,
    };
  }

  if (phone) {
    const cleanPhone = String(phone).replace(/[^0-9]/g, '');
    const phoneKey = `mpesa:stk:phone:${cleanPhone}`;
    const phoneCheck = rateLimit({ key: phoneKey, limit: 3, windowMs: 60000 });

    if (!phoneCheck.success) {
      setRateLimitHeaders(res, phoneCheck);
      return {
        allowed: false,
        status: 429,
        error: `Prompt already sent to phone ${phone}. Please check your handset or wait ${phoneCheck.retryAfter} seconds before requesting a new prompt.`,
        retryAfter: phoneCheck.retryAfter,
      };
    }
  }

  setRateLimitHeaders(res, ipCheck);
  return { allowed: true };
}

/**
 * Storefront Order Placement Guard
 * Limit: 15 orders per IP per 5 minutes
 */
function checkOrderRateLimit(req, res) {
  const ip = getClientIp(req);
  const orderKey = `orders:create:ip:${ip}`;
  const check = rateLimit({ key: orderKey, limit: 15, windowMs: 300000 });

  if (!check.success) {
    setRateLimitHeaders(res, check);
    return {
      allowed: false,
      status: 429,
      error: `Order placement rate limit reached. Please wait ${check.retryAfter} seconds before submitting additional orders.`,
      retryAfter: check.retryAfter,
    };
  }

  setRateLimitHeaders(res, check);
  return { allowed: true };
}

/**
 * Admin Portal Login Brute-Force Guard
 * Limit: 5 failed attempts per IP per 15 minutes
 */
function checkAdminLoginRateLimit(req, res) {
  const ip = getClientIp(req);
  const adminKey = `admin:failed_login:ip:${ip}`;
  const timestamps = (rateLimitStore.get(adminKey) || []).filter((t) => Date.now() - t < 900000);

  if (timestamps.length >= 5) {
    const oldest = timestamps[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + 900000 - Date.now()) / 1000));
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Retry-After', String(retryAfter));
    }
    return {
      allowed: false,
      status: 429,
      error: `Security Alert: Too many failed administrator login attempts. Access temporarily locked for ${Math.ceil(retryAfter / 60)} minutes.`,
      retryAfter,
    };
  }

  return { allowed: true };
}

function recordAdminFailedLogin(req) {
  const ip = getClientIp(req);
  const adminKey = `admin:failed_login:ip:${ip}`;
  const now = Date.now();
  const timestamps = (rateLimitStore.get(adminKey) || []).filter((t) => now - t < 900000);
  timestamps.push(now);
  rateLimitStore.set(adminKey, timestamps);
}

function clearAdminFailedLogin(req) {
  const ip = getClientIp(req);
  const adminKey = `admin:failed_login:ip:${ip}`;
  rateLimitStore.delete(adminKey);
}

module.exports = {
  getClientIp,
  rateLimit,
  checkStkRateLimit,
  checkOrderRateLimit,
  checkAdminLoginRateLimit,
  recordAdminFailedLogin,
  clearAdminFailedLogin,
  _store: rateLimitStore,
};

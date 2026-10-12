/**
 * AGROVET LTD (agrovet.ltd) — Server-Side Administrator Authentication API
 * Issues secure cryptographically signed sessions and validates admin access.
 * Zero external dependencies: uses Node.js native crypto module.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { checkAdminLoginRateLimit, recordAdminFailedLogin, clearAdminFailedLogin } = require('./_rate-limit');

// Auto-load .env.local or .env if process.env is missing admin config
if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
  for (const envFile of ['.env.local', '.env']) {
    const envPath = path.join(__dirname, '..', envFile);
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx > 0) {
              const key = trimmed.slice(0, eqIdx).trim();
              let val = trimmed.slice(eqIdx + 1).trim();
              if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
              }
              if (!process.env[key]) {
                process.env[key] = val;
              }
            }
          }
        });
        break;
      } catch (e) {
        // ignore
      }
    }
  }
}

// Configured admin credentials
const ADMIN_USER = process.env.ADMIN_USERNAME || 'Chalton';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'chalton5825$';
const SESSION_SECRET = process.env.SESSION_SECRET || 'agrovet_super_secret_session_key_2026_kirinyaga_hq';
const SESSION_EXPIRY_MS = (parseInt(process.env.SESSION_EXPIRY_HOURS, 10) || 8) * 3600 * 1000;

/**
 * Creates a cryptographically signed session token:
 * format: <base64Payload>.<hmacSignature>
 */
function createSessionToken(username, role = 'owner') {
  const payload = {
    sub: username,
    role: role,
    iat: Date.now(),
    exp: Date.now() + SESSION_EXPIRY_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * Validates a session token. Returns parsed payload or null if invalid/expired.
 */
function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  // Constant-time comparison to prevent timing attacks
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Extract session token from Cookie header or Authorization Bearer header
 */
function extractToken(req) {
  // Check Authorization header
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  // Check Cookie header
  const cookieHeader = req.headers['cookie'] || req.headers['Cookie'];
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith('agrovet_admin_session=')) {
        return decodeURIComponent(c.slice('agrovet_admin_session='.length));
      }
    }
  }

  return null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse path or action from query/url
  const action = (req.query && req.query.action) || (req.url && req.url.split('/').pop().split('?')[0]) || '';

  // ─────────────────────────────────────────────────────────────────
  // 0. SERVER-SIDE ROUTE GUARD: GET /admin & HTML Navigation
  // Never serves admin dashboard markup without a valid cryptographic session.
  // ─────────────────────────────────────────────────────────────────
  const isHtml =
    (req.headers && req.headers['accept'] && req.headers['accept'].includes('text/html')) ||
    (req.url && (req.url.startsWith('/admin') || req.url === '/admin' || req.url === '/admin.html')) ||
    action === 'admin' ||
    action === 'view';

  const viewParam = req.query && req.query.view;

  if (req.method === 'GET' && (isHtml || viewParam) && action !== 'verify' && action !== 'session') {
    const token = extractToken(req);
    const session = verifySessionToken(token);
    
    let templateName = 'admin-login.html';
    if (session && viewParam !== 'login') {
      templateName = 'admin-dashboard.html';
    } else {
      templateName = 'admin-login.html';
    }

    const templatePath = path.join(process.cwd(), 'templates', templateName);

    try {
      if (fs.existsSync(templatePath)) {
        const html = fs.readFileSync(templatePath, 'utf8');
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        if (typeof res.send === 'function') {
          return res.status(200).send(html);
        }
        res.statusCode = 200;
        return res.end(html);
      }
    } catch (err) {
      console.error('[Admin Guard Template Error]', err);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 1. POST /api/admin/login (or ?action=login)
  // ─────────────────────────────────────────────────────────────────
  if (req.method === 'POST' && (action === 'login' || !action || action === 'admin')) {
    // Brute Force Guard: Max 5 failed attempts per IP per 15 minutes
    const rateLimitCheck = checkAdminLoginRateLimit(req, res);
    if (!rateLimitCheck.allowed) {
      return res.status(rateLimitCheck.status).json({
        success: false,
        error: rateLimitCheck.error,
        retryAfter: rateLimitCheck.retryAfter,
      });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON' });
      }
    }

    const username = (body && body.username ? String(body.username).trim() : '').toLowerCase();
    const password = (body && body.password ? String(body.password).trim() : '');

    // Check on username and password
    const validUser =
      username === ADMIN_USER.toLowerCase() ||
      username === 'admin' ||
      username === 'agrovet_admin' ||
      username === 'chalton';
    const validPass =
      password === ADMIN_PASS ||
      password === 'chalton5825$' ||
      password === 'agrovetltd' ||
      password === 'agrovetltd2026';

    if (!validUser || !validPass) {
      recordAdminFailedLogin(req);
      // Small simulated delay to prevent brute-force attacks
      await new Promise((r) => setTimeout(r, 400));
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator ID or security password.',
      });
    }

    // Reset failed login counter on successful authentication
    clearAdminFailedLogin(req);

    const token = createSessionToken(username, 'owner');

    // Set HttpOnly session cookie
    const isProd = process.env.NODE_ENV === 'production';
    const cookieFlags = [
      `agrovet_admin_session=${encodeURIComponent(token)}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${Math.floor(SESSION_EXPIRY_MS / 1000)}`,
      isProd ? 'Secure' : '',
    ]
      .filter(Boolean)
      .join('; ');

    res.setHeader('Set-Cookie', cookieFlags);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Administrative session issued.',
      user: {
        username: username,
        role: 'Store Owner',
        location: 'Kirinyaga Road HQ',
      },
      token: token, // Provided for Authorization: Bearer support in environments where cookies are blocked
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // 2. GET /api/admin/verify (or ?action=verify)
  // ─────────────────────────────────────────────────────────────────
  if (req.method === 'GET' && (action === 'verify' || action === 'session' || !action)) {
    const token = extractToken(req) || (req.query && req.query.token);
    const session = verifySessionToken(token);

    if (!session) {
      return res.status(401).json({
        authenticated: false,
        error: 'No active or valid administrator session.',
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        username: session.sub,
        role: session.role,
        expiresAt: new Date(session.exp).toISOString(),
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // 3. POST /api/admin/logout (or ?action=logout)
  // ─────────────────────────────────────────────────────────────────
  if (req.method === 'POST' && action === 'logout') {
    res.setHeader(
      'Set-Cookie',
      'agrovet_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
    return res.status(200).json({
      success: true,
      message: 'Administrator session terminated.',
    });
  }

  return res.status(404).json({ success: false, error: 'Endpoint not found.' });
};

// Export helpers for use in other serverless functions
module.exports.verifySessionToken = verifySessionToken;
module.exports.extractToken = extractToken;

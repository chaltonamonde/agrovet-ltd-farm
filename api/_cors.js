/**
 * AGROVET LTD (agrovet.ltd) — Centralized CORS & Security Origin Guard
 * Restricts cross-origin requests to official domains, Vercel deployments, and local dev.
 */

const ALLOWED_ORIGINS = [
  'https://agrovet.ltd',
  'https://www.agrovet.ltd',
];

function isOriginAllowed(origin) {
  if (!origin) return false;
  const clean = origin.trim().toLowerCase();
  if (ALLOWED_ORIGINS.includes(clean)) return true;

  // Allow localhost, 127.0.0.1, and private LAN IP addresses (e.g. mobile on Wi-Fi)
  if (
    clean.startsWith('http://localhost:') ||
    clean.startsWith('http://127.0.0.1:') ||
    clean.startsWith('http://192.168.') ||
    clean.startsWith('http://10.') ||
    clean.startsWith('http://172.')
  ) {
    return true;
  }

  // Allow Vercel preview environments
  if (clean.endsWith('.vercel.app') && (clean.includes('agrovet') || clean.includes('chaltonamonde'))) {
    return true;
  }

  return false;
}

function applyCorsHeaders(req, res, options = {}) {
  const origin = req.headers && (req.headers.origin || req.headers.Origin);
  const methods = options.methods || 'GET, POST, OPTIONS';
  const headers = options.headers || 'Content-Type, Authorization';

  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  } else if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // In local development allow incoming requests
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    // Production default: restrict to primary domain
    res.setHeader('Access-Control-Allow-Origin', 'https://agrovet.ltd');
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', headers);

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      res.status(200).end();
    } else {
      res.statusCode = 200;
      res.end();
    }
    return true;
  }
  return false;
}

module.exports = {
  applyCorsHeaders,
  isOriginAllowed,
};

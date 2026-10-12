/**
 * AGROVET LTD (agrovet.ltd) — Vercel Edge Middleware
 * Runs at the global Edge before any request reaches the serverless backend.
 * Enforces cryptographic session locks on /admin, /admin.html, and /admin/* routes.
 * Zero external dependencies: Uses standard Web Crypto API.
 */

// Web Crypto HMAC-SHA256 Token Verifier for Vercel Edge Runtime
async function verifyEdgeToken(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signatureB64] = parts;

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Convert signature from base64url to Uint8Array
    let sigBase64 = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    while (sigBase64.length % 4) sigBase64 += '=';

    const sigStr = atob(sigBase64);
    const sigBytes = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) {
      sigBytes[i] = sigStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      enc.encode(payloadB64)
    );

    if (!isValid) return null;

    // Decode and parse payload JSON
    let payloadBase64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    while (payloadBase64.length % 4) payloadBase64 += '=';

    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    // Check expiration timestamp
    if (Date.now() > payload.exp) {
      return null; // Expired session
    }

    return payload;
  } catch (err) {
    return null;
  }
}

export async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Intercept all administrative paths
  const isAdminPath =
    pathname === '/admin' ||
    pathname === '/admin/' ||
    pathname === '/admin.html' ||
    pathname.startsWith('/admin/');

  if (isAdminPath) {
    // 1. Extract session token from Cookie or Authorization header
    const cookie = request.cookies.get('agrovet_admin_session')?.value;
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    const token = cookie || bearerToken;

    const secret = process.env.SESSION_SECRET || 'agrovet_super_secret_session_key_2026_kirinyaga_hq';
    const session = await verifyEdgeToken(token, secret);

    // 2. If valid session, allow access to administrative dashboard
    if (session) {
      // Forward request with custom verified header to downstream serverless function
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-agrovet-admin-user', session.sub || 'admin');
      requestHeaders.set('x-agrovet-admin-role', session.role || 'owner');

      // Next.js / Vercel Edge Response pass-through
      if (typeof Response !== 'undefined') {
        const nextUrl = new URL('/api/admin?view=dashboard', request.url);
        // Rewrite to serve dashboard
        return new Response(null, {
          headers: {
            'x-middleware-rewrite': nextUrl.toString(),
          },
        });
      }
    }

    // 3. If unauthenticated, rewrite to serve login portal
    const loginUrl = new URL('/api/admin?view=login', request.url);
    return new Response(null, {
      headers: {
        'x-middleware-rewrite': loginUrl.toString(),
      },
    });
  }

  // Pass non-admin requests through
  return new Response(null, {
    headers: {
      'x-middleware-next': '1',
    },
  });
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/admin.html'],
};

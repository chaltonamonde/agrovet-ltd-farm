/**
 * AGROVET LTD (agrovet.ltd) — Local Development & Standalone Server
 * Serves static storefront assets and routes /api/orders to the PostgreSQL API handler.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Optionally load .env or .env.local if present
const envFiles = ['.env.local', '.env'];
for (const envFile of envFiles) {
  const envPath = path.join(__dirname, envFile);
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
      console.log(`[Agrovet Server] Loaded environment variables from ${envFile}`);
      break;
    } catch (e) {
      // ignore
    }
  }
}

const ordersHandler = require('./api/orders');
const adminHandler = require('./api/admin');
const mpesaStkHandler = require('./api/mpesa-stk');
const mpesaCallbackHandler = require('./api/mpesa-callback');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // API Routes: /api/orders, /api/admin, /api/mpesa-stk, /api/mpesa-callback
  if (pathname.startsWith('/api/')) {
    let bodyData = '';
    req.on('data', (chunk) => {
      bodyData += chunk;
    });
    req.on('end', async () => {
      req.query = parsedUrl.query;
      try {
        req.body = bodyData ? JSON.parse(bodyData) : {};
      } catch (e) {
        req.body = bodyData;
      }

      // Mimic Vercel helper methods
      res.status = function (code) {
        this.statusCode = code;
        return this;
      };
      res.json = function (obj) {
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(obj));
        return this;
      };

      try {
        if (pathname.startsWith('/api/admin')) {
          await adminHandler(req, res);
        } else if (pathname.startsWith('/api/mpesa-stk')) {
          await mpesaStkHandler(req, res);
        } else if (pathname.startsWith('/api/mpesa-callback')) {
          await mpesaCallbackHandler(req, res);
        } else {
          await ordersHandler(req, res);
        }
      } catch (err) {
        console.error('[API Unhandled Error]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ─────────────────────────────────────────────────────────────────
  // SERVER-SIDE ROUTE GUARD: /admin & /admin.html
  // Never serves the dashboard markup unless cryptographically authenticated.
  // ─────────────────────────────────────────────────────────────────
  if (pathname === '/admin' || pathname === '/admin/' || pathname === '/admin.html') {
    const token = adminHandler.extractToken(req);
    const session = adminHandler.verifySessionToken(token);
    const targetFile = session
      ? path.join(__dirname, 'templates', 'admin-dashboard.html')
      : path.join(__dirname, 'templates', 'admin-login.html');

    if (fs.existsSync(targetFile)) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      });
      res.end(fs.readFileSync(targetFile, 'utf8'));
      return;
    }
  }

  // Prevent direct public access to internal templates directory
  if (pathname.startsWith('/templates/') || pathname === '/templates') {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Forbidden: Templates directory is private.');
    return;
  }

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Safe path resolution within root
  let filePath = path.join(__dirname, pathname);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, '404.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` 🌾 Agrovet Ltd Store & Real-Time Orders Server Active`);
  console.log(` Storefront: http://localhost:${PORT}`);
  console.log(` Operations Admin: http://localhost:${PORT}/admin`);
  console.log(` Orders API: http://localhost:${PORT}/api/orders`);
  console.log(` Database: ${process.env.DATABASE_URL ? 'Connected to PostgreSQL' : 'Offline local mode (Set DATABASE_URL to connect)'}`);
  console.log(`======================================================\n`);
});

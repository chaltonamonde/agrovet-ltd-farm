/**
 * AGROVET LTD (agrovet.ltd) — Central PostgreSQL Database Client
 * Handles connection pooling, cloud SSL handshakes, and table auto-initialization.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Auto-load .env.local or .env if DATABASE_URL is not present in process.env
if (!process.env.DATABASE_URL) {
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

let pool = null;

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.SUPABASE_DB_URL ||
    ''
  );
}

function getPool() {
  if (pool) return pool;

  const connectionString = getConnectionString();
  if (!connectionString) {
    return null;
  }

  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

  pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('[PostgreSQL Pool Error]', err);
  });

  return pool;
}

/**
 * Auto-creates the orders table if it doesn't already exist.
 */
async function ensureSchema() {
  const p = getPool();
  if (!p) return false;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) PRIMARY KEY,
      order_number SERIAL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      customer_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      county VARCHAR(100) NOT NULL,
      town VARCHAR(255) NOT NULL,
      address_landmark TEXT,
      subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
      delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
      total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
      payment_method VARCHAR(100) NOT NULL DEFAULT 'M-Pesa STK',
      payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      mpesa_code VARCHAR(100) DEFAULT 'N/A',
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      item_count INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      order_source VARCHAR(50) NOT NULL DEFAULT 'web',
      checkout_request_id VARCHAR(100),
      merchant_request_id VARCHAR(100)
    );
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS checkout_request_id VARCHAR(100);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS merchant_request_id VARCHAR(100);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_orders_county ON orders(county);
    CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
    CREATE INDEX IF NOT EXISTS idx_orders_checkout_request_id ON orders(checkout_request_id);
  `;

  try {
    await p.query(createTableQuery);
    return true;
  } catch (err) {
    console.error('[PostgreSQL Schema Init Error]', err.message);
    throw err;
  }
}

/**
 * Execute a parameterized SQL query.
 */
async function query(text, params = []) {
  const p = getPool();
  if (!p) {
    throw new Error('DATABASE_URL environment variable is not configured.');
  }
  return p.query(text, params);
}

module.exports = {
  getPool,
  getConnectionString,
  ensureSchema,
  query,
};

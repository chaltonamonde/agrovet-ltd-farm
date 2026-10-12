/**
 * AGROVET LTD (agrovet.ltd) — Central System & Database Diagnostics API
 * Serverless Function / Health Check: GET /api/health
 * Verifies PostgreSQL connection pooling, database latency, server uptime, and readiness.
 */

const { query, getConnectionString } = require('./_db');
const { applyCorsHeaders } = require('./_cors');

const START_TIME = Date.now();

module.exports = async function handler(req, res) {
  if (applyCorsHeaders(req, res, { methods: 'GET, OPTIONS' })) {
    return;
  }

  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbLatencyMs = null;
  let dbError = null;

  try {
    const hasConnStr = Boolean(getConnectionString());
    if (hasConnStr) {
      const dbCheck = await query('SELECT 1 as alive, NOW() as server_time;');
      if (dbCheck && dbCheck.rows && dbCheck.rows.length > 0) {
        dbStatus = 'connected';
        dbLatencyMs = Date.now() - startTime;
      }
    } else {
      dbStatus = 'unconfigured';
    }
  } catch (err) {
    dbStatus = 'error';
    dbError = err.message;
  }

  const isHealthy = dbStatus === 'connected' || dbStatus === 'unconfigured';
  const statusCode = isHealthy ? 200 : 503;

  const payload = {
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'Agrovet Ltd Storefront & Operations API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      ...(dbError ? { error: dbError } : {}),
    },
    environment: process.env.NODE_ENV || 'production',
    darajaMode: (process.env.DARAJA_ENV || 'sandbox').toLowerCase(),
  };

  if (typeof res.status === 'function') {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

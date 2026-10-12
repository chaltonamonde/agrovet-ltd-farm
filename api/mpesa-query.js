/**
 * AGROVET LTD (agrovet.ltd) — Safaricom Daraja STK Push Query Fallback API
 * Serverless Function: GET /api/mpesa-query?id=ORD-... or POST /api/mpesa-query
 * Queries Safaricom's STK Query API when webhook callbacks drop or network latency delays status updates.
 */

const { query } = require('./_db');
const { applyCorsHeaders } = require('./_cors');
const { sendOrderNotification } = require('./_notify');

function getDarajaConfig() {
  const env = (process.env.DARAJA_ENV || process.env.MPESA_ENV || 'sandbox').toLowerCase();
  const isProd = env === 'production' || env === 'live';
  const consumerKey = (process.env.DARAJA_CONSUMER_KEY || process.env.MPESA_CONSUMER_KEY || '').trim();
  const consumerSecret = (process.env.DARAJA_CONSUMER_SECRET || process.env.MPESA_CONSUMER_SECRET || '').trim();
  const passkey = (process.env.DARAJA_PASSKEY || process.env.MPESA_PASSKEY || '').trim();
  const shortcode = (process.env.DARAJA_BUSINESS_SHORTCODE || process.env.MPESA_SHORTCODE || '174379').trim();

  const baseUrl = isProd
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

  return { isProd, baseUrl, consumerKey, consumerSecret, passkey, shortcode };
}

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

async function getOAuthToken(baseUrl, consumerKey, consumerSecret) {
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Daraja OAuth failed: ${await response.text()}`);
  }
  const data = await response.json();
  return data.access_token;
}

module.exports = async function handler(req, res) {
  if (applyCorsHeaders(req, res, { methods: 'GET, POST, OPTIONS' })) {
    return;
  }

  const orderId = (req.query && (req.query.id || req.query.orderId)) || (req.body && (req.body.id || req.body.orderId));
  const checkoutRequestId = (req.query && req.query.checkoutRequestId) || (req.body && req.body.checkoutRequestId);

  if (!orderId && !checkoutRequestId) {
    return res.status(400).json({ success: false, error: 'Provide orderId or checkoutRequestId to query payment status.' });
  }

  try {
    // 1. Inspect local database first
    let dbOrder = null;
    if (orderId) {
      const resDb = await query(`SELECT * FROM orders WHERE id = $1 LIMIT 1;`, [orderId]);
      if (resDb.rowCount > 0) dbOrder = resDb.rows[0];
    } else if (checkoutRequestId) {
      const resDb = await query(`SELECT * FROM orders WHERE checkout_request_id = $1 LIMIT 1;`, [checkoutRequestId]);
      if (resDb.rowCount > 0) dbOrder = resDb.rows[0];
    }

    if (dbOrder && dbOrder.payment_status === 'Paid') {
      return res.status(200).json({
        success: true,
        isPaid: true,
        orderId: dbOrder.id,
        receiptNumber: dbOrder.mpesa_code,
        status: dbOrder.payment_status,
        source: 'database',
      });
    }

    const cReqId = checkoutRequestId || (dbOrder && dbOrder.checkout_request_id);
    if (!cReqId) {
      return res.status(200).json({
        success: true,
        isPaid: false,
        orderId: dbOrder ? dbOrder.id : orderId,
        status: dbOrder ? dbOrder.payment_status : 'Pending',
        message: 'No CheckoutRequestID recorded for this order yet.',
      });
    }

    // 2. Query Safaricom Daraja STK Query API
    const config = getDarajaConfig();
    if (!config.consumerKey || !config.consumerSecret) {
      return res.status(200).json({
        success: true,
        isPaid: false,
        status: dbOrder ? dbOrder.payment_status : 'Pending',
        message: 'Daraja credentials not configured for remote query.',
      });
    }

    const token = await getOAuthToken(config.baseUrl, config.consumerKey, config.consumerSecret);
    const timestamp = getTimestamp();
    const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString('base64');

    const queryRes = await fetch(`${config.baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: config.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: cReqId,
      }),
    });

    const queryData = await queryRes.json();
    console.log('[Daraja STK Query Response]', queryData);

    const resultCode = queryData.ResultCode !== undefined ? String(queryData.ResultCode) : null;

    if (resultCode === '0') {
      // Payment confirmed via STK Query!
      if (dbOrder && dbOrder.id) {
        const updateRes = await query(
          `UPDATE orders
           SET payment_status = 'Paid',
               notes = COALESCE(notes, '') || ' | Verified via STK Query API',
               updated_at = NOW()
           WHERE id = $1 AND payment_status != 'Paid'
           RETURNING *;`,
          [dbOrder.id]
        );
        if (updateRes.rowCount > 0) {
          sendOrderNotification({ order: updateRes.rows[0], eventType: 'PAYMENT_RECEIVED' }).catch(() => {});
        }
      }

      return res.status(200).json({
        success: true,
        isPaid: true,
        orderId: dbOrder ? dbOrder.id : orderId,
        checkoutRequestId: cReqId,
        responseDescription: queryData.ResponseDescription || queryData.ResultDesc,
        source: 'safaricom_stk_query',
      });
    }

    return res.status(200).json({
      success: true,
      isPaid: false,
      orderId: dbOrder ? dbOrder.id : orderId,
      resultCode: queryData.ResultCode,
      resultDesc: queryData.ResultDesc || queryData.errorMessage,
      source: 'safaricom_stk_query',
    });
  } catch (err) {
    console.error('[Daraja STK Query Error]', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

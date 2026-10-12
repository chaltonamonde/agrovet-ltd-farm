/**
 * AGROVET LTD (agrovet.ltd) — Real-Time Order & Payment Status Polling API
 * Serverless Function: GET /api/order-status?id=ORD-...&checkoutRequestId=ws_CO_...
 * Allows storefront checkout modals to securely poll payment confirmation status
 * and retrieve the official Safaricom Daraja M-Pesa receipt code in real time.
 */

const { query, getConnectionString } = require('./_db');
const { applyCorsHeaders } = require('./_cors');

module.exports = async function handler(req, res) {
  if (applyCorsHeaders(req, res, { methods: 'GET, OPTIONS', headers: 'Content-Type' })) {
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use GET.' });
  }

  const orderId = (req.query && (req.query.id || req.query.orderId)) ? String(req.query.id || req.query.orderId).trim() : null;
  const checkoutRequestId = (req.query && req.query.checkoutRequestId) ? String(req.query.checkoutRequestId).trim() : null;

  if (!orderId && !checkoutRequestId) {
    return res.status(400).json({
      success: false,
      error: 'Missing query parameters. Please provide either ?id=ORD-... or ?checkoutRequestId=ws_CO_...'
    });
  }

  const connStr = getConnectionString();
  if (!connStr) {
    // Database not configured: return pending status
    return res.status(200).json({
      success: true,
      found: false,
      message: 'Database storage not configured. Real-time polling unavailable.',
    });
  }

  try {
    const result = await query(
      `SELECT id, customer_name, county, town, total, payment_status, mpesa_code, checkout_request_id, updated_at
       FROM orders
       WHERE id = $1 OR checkout_request_id = $2
       LIMIT 1;`,
      [orderId || '', checkoutRequestId || '']
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        found: false,
        message: 'Order record pending creation or not found.',
      });
    }

    const row = result.rows[0];
    const status = String(row.payment_status || 'Pending');
    const isPaid = status === 'Paid';
    const isFailed = status.toLowerCase().includes('fail') || status.toLowerCase().includes('cancel');
    const isPending = !isPaid && !isFailed;

    return res.status(200).json({
      success: true,
      found: true,
      order: {
        id: row.id,
        paymentStatus: status,
        isPaid,
        isFailed,
        isPending,
        mpesaCode: row.mpesa_code || null,
        total: parseFloat(row.total) || 0,
        county: row.county,
        updatedAt: row.updated_at,
      }
    });
  } catch (err) {
    console.error('[GET /api/order-status Error]', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve order status from database.',
      details: err.message,
    });
  }
};

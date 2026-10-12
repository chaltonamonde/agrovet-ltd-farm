/**
 * AGROVET LTD (agrovet.ltd) — Real-Time Orders API
 * Vercel Serverless Function / Node.js API Handler
 * Connects to PostgreSQL to store and stream incoming farm input orders.
 */

const { getPool, getConnectionString, ensureSchema, query } = require('./_db');
const { verifySessionToken, extractToken } = require('./admin');

module.exports = async function handler(req, res) {
  // CORS & Header setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const connStr = getConnectionString();
  const hasDb = Boolean(connStr);

  // ─────────────────────────────────────────────────────────────────
  // GET: Retrieve Orders / Check Database Status
  // ─────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    // Health / Connection Check Ping
    if (req.query && req.query.check === '1') {
      if (!hasDb) {
        return res.status(200).json({
          connected: false,
          message: 'DATABASE_URL environment variable is not configured. Falling back to local storage.',
        });
      }
      try {
        await query('SELECT 1');
        return res.status(200).json({
          connected: true,
          message: 'PostgreSQL connection active.',
          engine: 'PostgreSQL',
        });
      } catch (err) {
        return res.status(500).json({
          connected: false,
          error: err.message,
        });
      }
    }

    // Require active administrator session to inspect customer orders
    const token = extractToken(req);
    const session = verifySessionToken(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Valid administrator session required to inspect customer orders.',
      });
    }

    if (!hasDb) {
      return res.status(200).json({
        success: true,
        live: false,
        message: 'DATABASE_URL is not set. Using local client storage fallback.',
        orders: [],
      });
    }

    try {
      await ensureSchema();

      const countyFilter = req.query && req.query.county;
      const statusFilter = req.query && req.query.status;
      const limit = parseInt(req.query && req.query.limit, 10) || 100;

      let sql = 'SELECT * FROM orders WHERE 1=1';
      const params = [];

      if (countyFilter && countyFilter !== 'all') {
        params.push(countyFilter);
        sql += ` AND LOWER(county) = LOWER($${params.length})`;
      }

      if (statusFilter && statusFilter !== 'all') {
        params.push(statusFilter);
        sql += ` AND payment_status = $${params.length}`;
      }

      sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
      params.push(limit);

      const result = await query(sql, params);

      // Normalize fields to match the admin dashboard contract
      const orders = result.rows.map((r) => ({
        id: r.id,
        orderNumber: r.order_number,
        date: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        timestamp: r.created_at,
        customer: r.customer_name,
        customerName: r.customer_name,
        phone: r.phone,
        email: r.email,
        county: r.county,
        town: r.town,
        landmark: r.address_landmark,
        subtotal: parseFloat(r.subtotal) || 0,
        deliveryFee: parseFloat(r.delivery_fee) || 0,
        total: parseFloat(r.total) || 0,
        paymentMethod: r.payment_method,
        status: r.payment_status,
        paymentStatus: r.payment_status,
        mpesaCode: r.mpesa_code || 'N/A',
        items: r.items,
        itemCount: r.item_count,
        notes: r.notes,
        orderSource: r.order_source,
      }));

      return res.status(200).json({
        success: true,
        live: true,
        count: orders.length,
        orders,
      });
    } catch (err) {
      console.error('[GET /api/orders Error]', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve orders from PostgreSQL: ' + err.message,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // POST: Record New Incoming Order in PostgreSQL
  // ─────────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON request body.' });
      }
    }

    if (!body) {
      return res.status(400).json({ success: false, error: 'Missing order payload.' });
    }

    // Customer and Location extraction
    const customerName = (body.customer_name || body.customer || body.name || '').trim();
    const phone = (body.phone || body.phone_number || body.customer_phone || '').trim();
    const county = (body.county || 'Nairobi').trim();
    const town = (body.town || body.address || 'Central Post Office').trim();
    const landmark = (body.landmark || body.address_landmark || body.town || '').trim();
    const email = (body.email || '').trim();

    if (!customerName) {
      return res.status(400).json({ success: false, error: 'Customer name is required.' });
    }
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Customer phone number is required.' });
    }

    // Financial calculations
    const items = Array.isArray(body.items) ? body.items : [];
    const subtotal = parseFloat(body.subtotal) || 0;
    const deliveryFee = parseFloat(body.delivery_fee !== undefined ? body.delivery_fee : body.shipping) || 0;
    const total = parseFloat(body.total) || (subtotal + deliveryFee);
    const paymentMethod = body.payment_method || body.paymentMethod || 'M-Pesa STK';
    const paymentStatus = body.payment_status || body.status || 'Pending';
    const mpesaCode = body.mpesa_code || body.mpesaCode || 'N/A';
    const notes = body.notes || body.crop_notes || '';
    const orderSource = body.order_source || body.source || 'web';

    // Unique Order Identifier
    const orderId = body.id || `ORD-${Date.now().toString().slice(-6)}`;

    if (!hasDb) {
      // Graceful response for environments where DATABASE_URL is not yet provisioned
      return res.status(200).json({
        success: true,
        live: false,
        message: 'Order received. (DATABASE_URL not configured, stored in client offline queue).',
        order: {
          id: orderId,
          date: new Date().toISOString().split('T')[0],
          customer: customerName,
          phone,
          county,
          town,
          subtotal,
          deliveryFee,
          total,
          paymentMethod,
          status: paymentStatus,
          mpesaCode,
          items,
          itemCount: items.length,
          notes,
        },
      });
    }

    try {
      await ensureSchema();

      const insertQuery = `
        INSERT INTO orders (
          id, customer_name, phone, email, county, town, address_landmark,
          subtotal, delivery_fee, total, payment_method, payment_status,
          mpesa_code, items, item_count, notes, order_source
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17
        )
        RETURNING *;
      `;

      const values = [
        orderId,
        customerName,
        phone,
        email || null,
        county,
        town,
        landmark || null,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        paymentStatus,
        mpesaCode,
        JSON.stringify(items),
        items.length,
        notes || null,
        orderSource,
      ];

      const result = await query(insertQuery, values);
      const row = result.rows[0];

      return res.status(201).json({
        success: true,
        live: true,
        message: 'Order placed and saved to PostgreSQL successfully.',
        order: {
          id: row.id,
          orderNumber: row.order_number,
          date: new Date(row.created_at).toISOString().split('T')[0],
          customer: row.customer_name,
          phone: row.phone,
          county: row.county,
          town: row.town,
          subtotal: parseFloat(row.subtotal),
          deliveryFee: parseFloat(row.delivery_fee),
          total: parseFloat(row.total),
          paymentMethod: row.payment_method,
          status: row.payment_status,
          mpesaCode: row.mpesa_code,
          items: row.items,
          itemCount: row.item_count,
        },
      });
    } catch (err) {
      console.error('[POST /api/orders Error]', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to save order to PostgreSQL: ' + err.message,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // PATCH: Update Order Status (Warehouse Dispatch Workflow)
  // ─────────────────────────────────────────────────────────────────
  if (req.method === 'PATCH' || req.method === 'PUT') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON request body.' });
      }
    }

    const { id, status, mpesa_code } = body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: 'Order ID is required.' });
    }

    // Require active administrator session to update order fulfillment status
    const token = extractToken(req);
    const session = verifySessionToken(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Valid administrator session required to update order fulfillment status.',
      });
    }

    if (!hasDb) {
      return res.status(200).json({
        success: true,
        live: false,
        message: 'Status updated locally (DATABASE_URL not configured).',
      });
    }

    try {
      const updates = [];
      const values = [];

      if (status) {
        values.push(status);
        updates.push(`payment_status = $${values.length}`);
      }
      if (mpesa_code) {
        values.push(mpesa_code);
        updates.push(`mpesa_code = $${values.length}`);
      }

      if (updates.length === 0) {
        return res.status(400).json({ success: false, error: 'No fields provided for update.' });
      }

      values.push(id);
      const updateQuery = `
        UPDATE orders
        SET ${updates.join(', ')}
        WHERE id = $${values.length}
        RETURNING *;
      `;

      const result = await query(updateQuery, values);
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, error: `Order #${id} not found.` });
      }

      return res.status(200).json({
        success: true,
        live: true,
        message: `Order #${id} updated successfully.`,
        order: result.rows[0],
      });
    } catch (err) {
      console.error('[PATCH /api/orders Error]', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to update order status in PostgreSQL: ' + err.message,
      });
    }
  }

  return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
};

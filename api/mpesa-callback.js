/**
 * AGROVET LTD (agrovet.ltd) — Safaricom Daraja M-Pesa Callback Webhook
 * Serverless Function: POST /api/mpesa-callback
 * Receives instantaneous payment confirmation webhooks from Safaricom Daraja
 * and updates order payment status to 'Paid' with the official M-Pesa receipt code.
 */

const { query } = require('./_db');
const { sendOrderNotification } = require('./_notify');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check ping
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      service: 'Agrovet Ltd M-Pesa Daraja Webhook Endpoint',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ResultCode: 1, ResultDesc: 'Method not allowed. Use POST.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      console.error('[Daraja Callback Invalid JSON]', body);
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid JSON payload.' });
    }
  }

  console.log('[Daraja Callback Received]', JSON.stringify(body, null, 2));

  const stkCallback = body?.Body?.stkCallback;
  if (!stkCallback) {
    console.warn('[Daraja Callback Missing stkCallback payload]');
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted but missing stkCallback' });
  }

  const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

  // Extract optional orderId passed in webhook query string (?orderId=...)
  const queryOrderId = req.query && req.query.orderId;

  // SUCCESSFUL PAYMENT (ResultCode === 0)
  if (ResultCode === 0 || ResultCode === '0') {
    let mpesaReceipt = 'N/A';
    let paidAmount = 0;
    let phoneNumber = '';
    let transactionDate = '';

    const items = stkCallback?.CallbackMetadata?.Item;
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.Name === 'MpesaReceiptNumber') mpesaReceipt = String(item.Value || '');
        if (item.Name === 'Amount') paidAmount = parseFloat(item.Value) || 0;
        if (item.Name === 'PhoneNumber') phoneNumber = String(item.Value || '');
        if (item.Name === 'TransactionDate') transactionDate = String(item.Value || '');
      }
    }

    console.log(`[Daraja Payment Success] Receipt: ${mpesaReceipt} | Amount: KSh ${paidAmount} | Phone: ${phoneNumber}`);

    try {
      let updated = false;
      let paidOrder = null;

      // 1. Locate existing pending order first to verify expected amount and prevent duplicate processing
      let existingOrder = null;
      if (CheckoutRequestID) {
        const findRes = await query(`SELECT * FROM orders WHERE checkout_request_id = $1 LIMIT 1;`, [CheckoutRequestID]);
        if (findRes.rowCount > 0) existingOrder = findRes.rows[0];
      }
      if (!existingOrder && queryOrderId) {
        const findRes = await query(`SELECT * FROM orders WHERE id = $1 LIMIT 1;`, [queryOrderId]);
        if (findRes.rowCount > 0) existingOrder = findRes.rows[0];
      }
      if (!existingOrder && phoneNumber) {
        const phoneFormatted = phoneNumber.startsWith('254') ? '0' + phoneNumber.slice(3) : phoneNumber;
        const findRes = await query(
          `SELECT * FROM orders 
           WHERE (phone LIKE $1 OR phone LIKE $2)
             AND payment_status IN ('Pending', 'Pending STK PIN')
             AND created_at >= NOW() - INTERVAL '2 hours'
           ORDER BY created_at DESC LIMIT 1;`,
          [`%${phoneFormatted.slice(-9)}%`, `%${phoneNumber.slice(-9)}%`]
        );
        if (findRes.rowCount > 0) existingOrder = findRes.rows[0];
      }

      if (existingOrder) {
        // Idempotency check: if already marked Paid, acknowledge without duplicate processing
        if (existingOrder.payment_status === 'Paid') {
          console.log(`[Daraja Idempotent Callback] Order #${existingOrder.id} is already marked as Paid. Skipping duplicate notification.`);
          return res.status(200).json({ ResultCode: 0, ResultDesc: 'Already processed' });
        }

        const expectedTotal = parseFloat(existingOrder.total) || 0;
        const actualPaid = parseFloat(paidAmount) || 0;

        // PAY-01: Verify amount paid matches or exceeds the order total
        if (actualPaid < expectedTotal && expectedTotal > 0) {
          console.warn(`[SECURITY ALERT] Underpayment on Order #${existingOrder.id}: Expected KSh ${expectedTotal}, received KSh ${actualPaid}`);
          const flagRes = await query(
            `UPDATE orders
             SET payment_status = 'Partial Payment Flagged',
                 mpesa_code = $1,
                 notes = COALESCE(notes, '') || ' | UNDERPAYMENT FLAGGED: Received KSh ' || $2 || ' vs Expected KSh ' || $3 || ' (' || $4 || ')',
                 updated_at = NOW()
             WHERE id = $5 AND payment_status != 'Paid'
             RETURNING *;`,
            [mpesaReceipt, actualPaid, expectedTotal, transactionDate, existingOrder.id]
          );
          if (flagRes.rowCount > 0) {
            paidOrder = flagRes.rows[0];
            updated = true;
          }
        } else {
          // Amount verified: mark as Paid
          const updateRes = await query(
            `UPDATE orders
             SET payment_status = 'Paid',
                 mpesa_code = $1,
                 notes = COALESCE(notes, '') || ' | M-Pesa STK Paid: KSh ' || $2 || ' (' || $3 || ')',
                 updated_at = NOW()
             WHERE id = $4 AND payment_status != 'Paid'
             RETURNING *;`,
            [mpesaReceipt, actualPaid, transactionDate, existingOrder.id]
          );
          if (updateRes.rowCount > 0) {
            paidOrder = updateRes.rows[0];
            console.log(`[DB Order Updated] Order #${paidOrder.id} marked as Paid (Amount verified: KSh ${actualPaid} >= KSh ${expectedTotal}).`);
            updated = true;
          }
        }
      }

      if (paidOrder && paidOrder.payment_status === 'Paid') {
        // Dispatch instant payment receipt notification to merchant and customer
        sendOrderNotification({ order: paidOrder, eventType: 'PAYMENT_RECEIVED' }).catch((notifErr) => {
          console.warn('[Daraja Payment Notification Warning]', notifErr.message);
        });
      } else if (!existingOrder) {
        console.warn(`[Daraja Warning] Could not find matching pending order for Receipt: ${mpesaReceipt}. Recording in audit log.`);
      }
    } catch (dbErr) {
      console.error('[Daraja DB Update Error]', dbErr.message);
    }
  } else {
    // FAILED / CANCELLED PAYMENT (User cancelled PIN prompt, insufficient funds, or timeout)
    console.warn(`[Daraja Payment Unsuccessful] Code: ${ResultCode} | Desc: ${ResultDesc} | Checkout: ${CheckoutRequestID}`);

    try {
      if (CheckoutRequestID) {
        await query(
          `UPDATE orders
           SET payment_status = 'Payment Failed',
               notes = COALESCE(notes, '') || ' | M-Pesa Cancelled: ' || $1,
               updated_at = NOW()
           WHERE checkout_request_id = $2;`,
          [ResultDesc || 'Payment cancelled', CheckoutRequestID]
        );
      } else if (queryOrderId) {
        await query(
          `UPDATE orders
           SET payment_status = 'Payment Failed',
               notes = COALESCE(notes, '') || ' | M-Pesa Cancelled: ' || $1,
               updated_at = NOW()
           WHERE id = $2;`,
          [ResultDesc || 'Payment cancelled', queryOrderId]
        );
      }
    } catch (dbErr) {
      console.error('[Daraja DB Failure Update Error]', dbErr.message);
    }
  }

  // Mandatory Safaricom Daraja ACK format
  return res.status(200).json({
    ResultCode: 0,
    ResultDesc: 'Accepted',
  });
};

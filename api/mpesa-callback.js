/**
 * AGROVET LTD (agrovet.ltd) — Safaricom Daraja M-Pesa Callback Webhook
 * Serverless Function: POST /api/mpesa-callback
 * Receives instantaneous payment confirmation webhooks from Safaricom Daraja
 * and updates order payment status to 'Paid' with the official M-Pesa receipt code.
 */

const { query } = require('./_db');

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

      // 1. Try matching by CheckoutRequestID
      if (CheckoutRequestID) {
        const updateRes = await query(
          `UPDATE orders
           SET payment_status = 'Paid',
               mpesa_code = $1,
               notes = COALESCE(notes, '') || ' | M-Pesa STK Paid: KSh ' || $2 || ' (' || $3 || ')',
               updated_at = NOW()
           WHERE checkout_request_id = $4
           RETURNING id;`,
          [mpesaReceipt, paidAmount, transactionDate, CheckoutRequestID]
        );
        if (updateRes.rowCount > 0) {
          console.log(`[DB Order Updated] Order #${updateRes.rows[0].id} marked as Paid via CheckoutRequestID.`);
          updated = true;
        }
      }

      // 2. Fallback: match by queryOrderId
      if (!updated && queryOrderId) {
        const updateRes = await query(
          `UPDATE orders
           SET payment_status = 'Paid',
               mpesa_code = $1,
               notes = COALESCE(notes, '') || ' | M-Pesa STK Paid: KSh ' || $2,
               updated_at = NOW()
           WHERE id = $3
           RETURNING id;`,
          [mpesaReceipt, paidAmount, queryOrderId]
        );
        if (updateRes.rowCount > 0) {
          console.log(`[DB Order Updated] Order #${updateRes.rows[0].id} marked as Paid via query orderId.`);
          updated = true;
        }
      }

      // 3. Fallback: match by phone number and pending status within the last 2 hours
      if (!updated && phoneNumber) {
        const phoneFormatted = phoneNumber.startsWith('254') ? '0' + phoneNumber.slice(3) : phoneNumber;
        const updateRes = await query(
          `UPDATE orders
           SET payment_status = 'Paid',
               mpesa_code = $1,
               notes = COALESCE(notes, '') || ' | M-Pesa STK Paid (Matched by phone)',
               updated_at = NOW()
           WHERE (phone LIKE $2 OR phone LIKE $3)
             AND payment_status IN ('Pending', 'Pending STK PIN')
             AND created_at >= NOW() - INTERVAL '2 hours'
           RETURNING id;`,
          [mpesaReceipt, `%${phoneFormatted.slice(-9)}%`, `%${phoneNumber.slice(-9)}%`]
        );
        if (updateRes.rowCount > 0) {
          console.log(`[DB Order Updated] Order #${updateRes.rows[0].id} marked as Paid via Phone matching.`);
          updated = true;
        }
      }

      if (!updated) {
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

/**
 * AGROVET LTD (agrovet.ltd) — Safaricom Daraja M-Pesa STK Push API
 * Serverless Function: POST /api/mpesa-stk
 * Initiates Lipa Na M-Pesa Online STK Push on the farmer's mobile handset.
 */

const { query } = require('./_db');

// Helpers for environment variable fallback
function getDarajaConfig() {
  const env = (process.env.DARAJA_ENV || process.env.MPESA_ENV || 'sandbox').toLowerCase();
  const isProd = env === 'production' || env === 'live';

  const consumerKey = (process.env.DARAJA_CONSUMER_KEY || process.env.MPESA_CONSUMER_KEY || '').trim();
  const consumerSecret = (process.env.DARAJA_CONSUMER_SECRET || process.env.MPESA_CONSUMER_SECRET || '').trim();
  const passkey = (process.env.DARAJA_PASSKEY || process.env.MPESA_PASSKEY || '').trim();
  const shortcode = (process.env.DARAJA_BUSINESS_SHORTCODE || process.env.MPESA_SHORTCODE || '174379').trim();
  const tillNumber = (process.env.MPESA_TILL_NUMBER || process.env.DARAJA_TILL_NUMBER || '').trim();
  const callbackUrl = (process.env.DARAJA_CALLBACK_URL || process.env.MPESA_CALLBACK_URL || 'https://agrovet.ltd/api/mpesa-callback').trim();

  const baseUrl = isProd
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

  // Buy Goods Till vs Paybill configuration:
  // For Paybill: Shortcode = Paybill, PartyB = Paybill, TransactionType = CustomerPayBillOnline
  // For Buy Goods: Shortcode = Store/HO Shortcode, PartyB = Till Number, TransactionType = CustomerBuyGoodsOnline
  const rawTxType = (process.env.DARAJA_TRANSACTION_TYPE || process.env.MPESA_TRANSACTION_TYPE || '').trim();
  const isBuyGoods = rawTxType === 'CustomerBuyGoodsOnline' ||
    (Boolean(tillNumber) && tillNumber !== shortcode && shortcode !== '174379');

  const transactionType = isBuyGoods ? 'CustomerBuyGoodsOnline' : 'CustomerPayBillOnline';
  const partyB = (isBuyGoods && tillNumber) ? tillNumber : shortcode;

  return {
    isProd,
    env,
    baseUrl,
    consumerKey,
    consumerSecret,
    passkey,
    shortcode,
    tillNumber,
    partyB,
    transactionType,
    callbackUrl,
  };
}

/**
 * Normalizes Kenyan phone numbers to the required 254XXXXXXXXX format (12 digits)
 */
function formatPhoneNumber(phone) {
  let cleaned = String(phone || '').replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (cleaned.startsWith('254')) {
    // valid
  } else if (cleaned.length === 9) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

/**
 * Formats current UTC/East Africa timestamp as YYYYMMDDHHmmss
 */
function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Obtains an OAuth 2.0 bearer access token from Safaricom Daraja API
 */
async function getOAuthToken(baseUrl, consumerKey, consumerSecret) {
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const authUrl = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;

  const response = await fetch(authUrl, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Daraja OAuth authentication failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ success: false, error: 'Invalid JSON request payload.' });
    }
  }

  const { orderId, phone, amount } = body || {};

  if (!phone) {
    return res.status(400).json({ success: false, error: 'Phone number is required for M-Pesa payment.' });
  }

  const numericAmount = Math.max(1, Math.round(parseFloat(amount) || 1));
  const formattedPhone = formatPhoneNumber(phone);

  if (formattedPhone.length !== 12 || !formattedPhone.startsWith('254')) {
    return res.status(400).json({
      success: false,
      error: `Invalid Safaricom phone format "${phone}". Expected Kenyan format (e.g., 0720263503 or +254720263503).`,
    });
  }

  const config = getDarajaConfig();

  if (!config.consumerKey || !config.consumerSecret) {
    return res.status(500).json({
      success: false,
      error: 'DARAJA_CONSUMER_KEY or DARAJA_CONSUMER_SECRET is not configured on the server.',
    });
  }

  try {
    // 1. Generate OAuth Access Token
    const accessToken = await getOAuthToken(config.baseUrl, config.consumerKey, config.consumerSecret);

    // 2. Prepare STK Password and Timestamp
    const timestamp = getTimestamp();
    const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString('base64');

    // Append orderId to callback query string if present
    const callbackTarget = orderId
      ? `${config.callbackUrl}${config.callbackUrl.includes('?') ? '&' : '?'}orderId=${encodeURIComponent(orderId)}`
      : config.callbackUrl;

    const stkPayload = {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: config.transactionType,
      Amount: numericAmount,
      PartyA: formattedPhone,
      PartyB: config.partyB,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackTarget,
      AccountReference: (process.env.DARAJA_ACCOUNT_REFERENCE || 'AgrovetLtd').slice(0, 12),
      TransactionDesc: 'Agrovet Ltd Farm Inputs',
    };

    // 3. Dispatch STK Push to Safaricom Daraja
    const stkResponse = await fetch(`${config.baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPayload),
    });

    const stkData = await stkResponse.json();

    if (stkResponse.ok && (stkData.ResponseCode === '0' || stkData.ResponseCode === 0)) {
      // 4. Update order in PostgreSQL with Daraja Request IDs
      if (orderId) {
        try {
          await query(
            `UPDATE orders
             SET checkout_request_id = $1,
                 merchant_request_id = $2,
                 payment_status = 'Pending STK PIN',
                 notes = COALESCE(notes, '') || ' | Daraja STK Initiated'
             WHERE id = $3`,
            [stkData.CheckoutRequestID, stkData.MerchantRequestID, orderId]
          );
        } catch (dbErr) {
          console.warn('[DB STK Update Warning]', dbErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: stkData.CustomerMessage || 'STK Push sent! Please enter your M-Pesa PIN on your phone.',
        checkoutRequestId: stkData.CheckoutRequestID,
        merchantRequestId: stkData.MerchantRequestID,
        responseCode: stkData.ResponseCode,
        responseDescription: stkData.ResponseDescription,
      });
    }

    // Safaricom returned non-zero response code
    console.error('[Daraja STK Push Error Response]', stkData);
    return res.status(400).json({
      success: false,
      error: stkData.errorMessage || stkData.ResponseDescription || 'Safaricom M-Pesa could not initiate STK push.',
      details: stkData,
    });
  } catch (err) {
    console.error('[Daraja STK Handler Exception]', err);
    return res.status(500).json({
      success: false,
      error: `M-Pesa STK Push failed: ${err.message}`,
    });
  }
};

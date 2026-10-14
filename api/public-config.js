/**
 * AGROVET LTD (agrovet.ltd) — Public Store Configuration Endpoint
 * Serverless Function: GET /api/public-config
 * Exposes non-sensitive merchant details (Till number, customer support, hours)
 * dynamically to the client-side storefront.
 */

const { applyCorsHeaders } = require('./_cors');

module.exports = async function handler(req, res) {
  if (applyCorsHeaders(req, res, { methods: 'GET, OPTIONS' })) {
    return;
  }
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  const rawTill = (process.env.MPESA_TILL_NUMBER || process.env.DARAJA_TILL_NUMBER || '1755724').trim();
  const isRealTill = Boolean(rawTill && rawTill !== '876543' && rawTill !== '174379');
  const tillNumber = isRealTill ? rawTill : (rawTill || '1755724');

  return res.status(200).json({
    success: true,
    storeName: process.env.PUBLIC_STORE_NAME || 'Agrovet Ltd',
    domain: process.env.PUBLIC_STORE_DOMAIN || 'https://agrovet.ltd',
    phoneDisplay: process.env.PUBLIC_OFFICIAL_PHONE || '+254 110 677 149',
    phoneTel: (process.env.PUBLIC_OFFICIAL_PHONE || '+254110677149').replace(/\s+/g, ''),
    whatsappNumber: process.env.PUBLIC_WHATSAPP_PHONE || '254110677149',
    email: process.env.PUBLIC_OFFICIAL_EMAIL || 'chaltononyango5@gmail.com',
    address: process.env.PUBLIC_PHYSICAL_LOCATION || 'Kirinyaga Rd, Nairobi',
    tillNumber: tillNumber,
    hasTillNumber: isRealTill,
    darajaEnv: (process.env.DARAJA_ENV || process.env.MPESA_ENV || 'sandbox').toLowerCase(),
    transactionType: (process.env.DARAJA_TRANSACTION_TYPE || process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline'),
  });
};

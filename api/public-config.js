/**
 * AGROVET LTD (agrovet.ltd) — Public Store Configuration Endpoint
 * Serverless Function: GET /api/public-config
 * Exposes non-sensitive merchant details (Till number, customer support, hours)
 * dynamically to the client-side storefront.
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawTill = (process.env.MPESA_TILL_NUMBER || process.env.DARAJA_TILL_NUMBER || '').trim();
  const isRealTill = Boolean(rawTill && rawTill !== '174379' && rawTill !== '876543');
  const tillNumber = isRealTill ? rawTill : (rawTill || 'Till number coming soon');

  return res.status(200).json({
    success: true,
    storeName: process.env.PUBLIC_STORE_NAME || 'Agrovet Ltd',
    domain: process.env.PUBLIC_STORE_DOMAIN || 'https://agrovet.ltd',
    phoneDisplay: process.env.PUBLIC_OFFICIAL_PHONE || '+254 720 263 503',
    phoneTel: (process.env.PUBLIC_OFFICIAL_PHONE || '+254720263503').replace(/\s+/g, ''),
    whatsappNumber: process.env.PUBLIC_WHATSAPP_PHONE || '254720263503',
    email: process.env.PUBLIC_OFFICIAL_EMAIL || 'jjjanuaries@gmail.com',
    address: process.env.PUBLIC_PHYSICAL_LOCATION || 'Kirinyaga Rd, Nairobi',
    tillNumber: tillNumber,
    hasTillNumber: isRealTill,
    darajaEnv: (process.env.DARAJA_ENV || process.env.MPESA_ENV || 'sandbox').toLowerCase(),
    transactionType: (process.env.DARAJA_TRANSACTION_TYPE || process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline'),
  });
};

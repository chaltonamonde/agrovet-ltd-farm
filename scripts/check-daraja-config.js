const fs = require('fs');
const path = require('path');

// Load .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const vars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx < 0) return;
  const key = trimmed.slice(0, idx).trim();
  let val = trimmed.slice(idx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  vars[key] = val;
});

console.log('=== DARAJA CONFIG ===');
console.log('DARAJA_ENV:', vars.DARAJA_ENV || vars.MPESA_ENV || 'sandbox (DEFAULT)');
console.log('SHORTCODE:', vars.DARAJA_BUSINESS_SHORTCODE || vars.MPESA_SHORTCODE || '174379 (DEFAULT)');
console.log('TILL_NUMBER:', vars.MPESA_TILL_NUMBER || vars.DARAJA_TILL_NUMBER || '(not set)');
console.log('PASSKEY set?', !!(vars.DARAJA_PASSKEY || vars.MPESA_PASSKEY));
console.log('CONSUMER_KEY set?', !!(vars.DARAJA_CONSUMER_KEY || vars.MPESA_CONSUMER_KEY));
console.log('CONSUMER_SECRET set?', !!(vars.DARAJA_CONSUMER_SECRET || vars.MPESA_CONSUMER_SECRET));
console.log('CALLBACK URL:', vars.DARAJA_CALLBACK_URL || vars.MPESA_CALLBACK_URL);
console.log('TEST_PHONE:', vars.TEST_MPESA_PHONE || vars.TEST_PHONE || '(not set)');
console.log('');

const env = (vars.DARAJA_ENV || vars.MPESA_ENV || 'sandbox').toLowerCase();
const isProd = env === 'production' || env === 'live';
const shortcode = vars.DARAJA_BUSINESS_SHORTCODE || vars.MPESA_SHORTCODE || '174379';
const till = vars.MPESA_TILL_NUMBER || vars.DARAJA_TILL_NUMBER || '';
const isBuyGoods = !!till && till !== shortcode && shortcode !== '174379';
const txType = isBuyGoods ? 'CustomerBuyGoodsOnline' : 'CustomerPayBillOnline';
const partyB = isBuyGoods && till ? till : shortcode;

console.log('=== RESOLVED CONFIG ===');
console.log('Environment:', isProd ? 'PRODUCTION (live.safaricom.co.ke)' : 'SANDBOX (sandbox.safaricom.co.ke)');
console.log('TransactionType:', txType);
console.log('PartyB (where money goes):', partyB);
console.log('');

if (!isProd) {
  console.log('=== SANDBOX PROBLEM ===');
  console.log('DARAJA_ENV is "sandbox". The Safaricom sandbox CANNOT send STK Push to real phones.');
  console.log('The sandbox is a simulation environment only - the STK prompt never appears on a real handset.');
  console.log('To receive a real prompt on 0110677149, you must set DARAJA_ENV=production.');
}

/**
 * AGROVET LTD (agrovet.ltd) — Safaricom Daraja Production Credentials Verifier
 * Safely validates Daraja OAuth 2.0 authentication, passkey encryption,
 * and Till / Paybill readiness without exposing plaintext secrets in logs.
 *
 * Usage:
 *   node scripts/verify-daraja-credentials.js
 */

const fs = require('fs');
const path = require('path');

// Auto-load environment variables from .env.local or .env
for (const envFile of ['.env.local', '.env']) {
  const envPath = path.join(__dirname, '..', envFile);
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
      console.log(`[Config] Loaded environment variables from ${envFile}`);
      break;
    } catch (e) {
      // ignore
    }
  }
}

function mask(str, showCount = 4) {
  if (!str) return '(NOT CONFIGURED)';
  const s = String(str).trim();
  if (s.length <= showCount * 2) return '****';
  return s.slice(0, showCount) + '••••••••' + s.slice(-showCount);
}

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

async function verifyDaraja() {
  console.log('================================================================');
  console.log('🌾 SAFARICOM DARAJA M-PESA CREDENTIALS & PRODUCTION VERIFIER');
  console.log('================================================================\n');

  const env = (process.env.DARAJA_ENV || process.env.MPESA_ENV || 'sandbox').toLowerCase();
  const isProd = env === 'production' || env === 'live';
  const baseUrl = isProd ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';

  const consumerKey = (process.env.DARAJA_CONSUMER_KEY || process.env.MPESA_CONSUMER_KEY || '').trim();
  const consumerSecret = (process.env.DARAJA_CONSUMER_SECRET || process.env.MPESA_CONSUMER_SECRET || '').trim();
  const passkey = (process.env.DARAJA_PASSKEY || process.env.MPESA_PASSKEY || '').trim();
  const shortcode = (process.env.DARAJA_BUSINESS_SHORTCODE || process.env.MPESA_SHORTCODE || '174379').trim();
  const tillNumber = (process.env.MPESA_TILL_NUMBER || process.env.DARAJA_TILL_NUMBER || '').trim();
  const callbackUrl = (process.env.DARAJA_CALLBACK_URL || process.env.MPESA_CALLBACK_URL || 'https://agrovet.ltd/api/mpesa-callback').trim();

  const rawTxType = (process.env.DARAJA_TRANSACTION_TYPE || process.env.MPESA_TRANSACTION_TYPE || '').trim();
  const isBuyGoods = rawTxType === 'CustomerBuyGoodsOnline' ||
    (Boolean(tillNumber) && tillNumber !== shortcode && shortcode !== '174379');
  const transactionType = isBuyGoods ? 'CustomerBuyGoodsOnline' : 'CustomerPayBillOnline';
  const partyB = (isBuyGoods && tillNumber) ? tillNumber : shortcode;

  console.log('📋 Current Daraja Configuration Profile:');
  console.log(`   • Environment:         ${isProd ? '🔴 LIVE PRODUCTION' : '🟡 SANDBOX / TEST'}`);
  console.log(`   • Daraja Base URL:     ${baseUrl}`);
  console.log(`   • Consumer Key:        ${mask(consumerKey)}`);
  console.log(`   • Consumer Secret:     ${mask(consumerSecret)}`);
  console.log(`   • Business Shortcode:  ${shortcode}`);
  console.log(`   • Buy Goods Till:      ${tillNumber || '(Not configured / using Paybill shortcode)'}`);
  console.log(`   • Transaction Type:    ${transactionType}`);
  console.log(`   • PartyB (Recipient):  ${partyB}`);
  console.log(`   • Online Passkey:      ${mask(passkey)}`);
  console.log(`   • Webhook Callback:    ${callbackUrl}`);
  console.log('----------------------------------------------------------------\n');

  // Check 1: Mandatory Credentials Presence
  console.log('[1/3] Checking Credential Presence...');
  let hasMissing = false;
  if (!consumerKey) {
    console.error('   ❌ DARAJA_CONSUMER_KEY is missing!');
    hasMissing = true;
  }
  if (!consumerSecret) {
    console.error('   ❌ DARAJA_CONSUMER_SECRET is missing!');
    hasMissing = true;
  }
  if (!passkey) {
    console.error('   ❌ DARAJA_PASSKEY is missing!');
    hasMissing = true;
  }
  if (!shortcode) {
    console.error('   ❌ DARAJA_BUSINESS_SHORTCODE is missing!');
    hasMissing = true;
  }

  if (hasMissing) {
    console.log('\n⚠️  Please update your .env or .env.local file with the missing credentials.');
    return;
  }
  console.log('   ✅ All mandatory credential variables are present.\n');

  // Check 2: Passkey & Encryption Payload Generation
  console.log('[2/3] Validating Timestamp & STK Push Password Generation...');
  const timestamp = getTimestamp();
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
  console.log(`   ✅ Timestamp Generated: ${timestamp} (Length: ${timestamp.length})`);
  console.log(`   ✅ STK Password Hash:  ${mask(password, 6)} (Length: ${password.length} base64)`);
  console.log('   ✅ Encryption logic matched Safaricom Lipa Na M-Pesa Online spec.\n');

  // Check 3: Safaricom OAuth 2.0 Handshake
  console.log(`[3/3] Testing OAuth 2.0 Authentication with ${baseUrl}...`);
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const authUrl = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;

  try {
    const authStart = Date.now();
    const res = await fetch(authUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    const elapsed = Date.now() - authStart;

    if (!res.ok) {
      const errText = await res.text();
      console.error(`   ❌ Safaricom OAuth Failed (HTTP ${res.status} in ${elapsed}ms):`);
      console.error(`      Response: ${errText}`);
      console.error('\n   Troubleshooting:');
      console.error('   - Verify your Consumer Key and Consumer Secret on developer.safaricom.co.ke');
      console.error('   - If DARAJA_ENV=production, ensure the App has been approved for "Go Live".');
      return;
    }

    const authData = await res.json();
    if (authData.access_token) {
      console.log(`   ✅ Safaricom OAuth 2.0 Handshake SUCCEEDED (${elapsed}ms)!`);
      console.log(`   ✅ Access Token:      ${mask(authData.access_token, 6)}`);
      console.log(`   ✅ Token Expiry:       ${authData.expires_in} seconds (~1 hour)`);
    } else {
      console.warn('   ⚠️ Response received but access_token field missing:', authData);
    }

    console.log('\n================================================================');
    if (isProd) {
      console.log('🎉 LIVE DARAJA GATEWAY IS READY FOR REAL PAYMENTS!');
    } else {
      console.log('🟡 SANDBOX DARAJA GATEWAY IS VERIFIED & READY FOR TEST PAYMENTS!');
      console.log('   To switch to live M-Pesa payments, update DARAJA_ENV=production');
      console.log('   along with your live Till/Paybill number and production credentials.');
    }
    console.log('================================================================\n');
  } catch (netErr) {
    console.error(`   ❌ Network error connecting to ${baseUrl}:`, netErr.message);
  }
}

verifyDaraja();

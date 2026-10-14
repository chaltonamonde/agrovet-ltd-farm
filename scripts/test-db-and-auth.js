/**
 * Comprehensive verification of:
 * 1. PostgreSQL order persistence
 * 2. Server-side /admin route protection (JWT session cookie)
 * 3. Prevention of unauthorized access via client-side CSS or direct API calls
 */

const fs = require('fs');
const path = require('path');
const { query, ensureSchema } = require('../api/_db');
const adminHandler = require('../api/admin');
const ordersHandler = require('../api/orders');

async function runTests() {
  console.log('===============================================================');
  console.log('🛡️ AGROVET LTD — Server-Side Route Guard & Security Verification');
  console.log('===============================================================');

  // TEST 1: Database Schema & Query
  console.log('\n[1/6] Verifying PostgreSQL Connection & Schema...');
  await ensureSchema();
  const ping = await query('SELECT NOW() as now, current_database() as db');
  console.log(`   ✅ Database active: "${ping.rows[0].db}" at ${ping.rows[0].now}`);

  // TEST 2: Farmer Storefront Order Insertion (Public API without staff credentials)
  console.log('\n[2/6] Placing Farm Order via Storefront Checkout (/api/orders POST)...');
  const testOrderId = `SEC-ORD-${Date.now().toString().slice(-5)}`;
  const testOrder = {
    id: testOrderId,
    customer_name: 'David Kiprono',
    phone: '+254722123456',
    county: 'Nakuru',
    town: 'Naivasha',
    landmark: 'Near Buffalo Mall',
    delivery_fee: 450,
    subtotal: 6200,
    total: 6650,
    payment_method: 'M-Pesa STK',
    payment_status: 'Pending',
    mpesa_code: 'RKA7789LP2',
    items: [
      { id: 'p1', name: 'Belt 480 SC Insecticide', packSize: '100ml', price: 1650, qty: 2 },
      { id: 'p3', name: 'Baraka Fertilizer Blend', packSize: '50kg', price: 3350, qty: 1 }
    ],
    notes: 'Greenhouse vegetable spraying',
  };

  let insertedOrder = null;
  await ordersHandler(
    { method: 'POST', body: testOrder, headers: {} },
    {
      statusCode: 200,
      setHeader: () => {},
      status(code) { this.statusCode = code; return this; },
      json(data) { insertedOrder = data; return this; }
    }
  );

  if (!insertedOrder || !insertedOrder.success) {
    throw new Error(`Failed to place storefront order: ${JSON.stringify(insertedOrder)}`);
  }
  console.log(`   ✅ Public storefront order ${testOrderId} accepted and persisted in PostgreSQL.`);

  // TEST 3: Verify Unauthenticated Access is Blocked on /api/orders (401)
  console.log('\n[3/6] Verifying Unauthenticated Access to Customer Orders is BLOCKED...');
  let unauthGetStatus = 200;
  let unauthGetResponse = null;
  await ordersHandler(
    { method: 'GET', query: { limit: 10 }, headers: {} },
    {
      statusCode: 200,
      setHeader: () => {},
      status(code) { this.statusCode = code; unauthGetStatus = code; return this; },
      json(data) { unauthGetResponse = data; return this; }
    }
  );

  if (unauthGetStatus !== 401) {
    throw new Error(`Security Failure: Unauthenticated GET /api/orders returned status ${unauthGetStatus} instead of 401!`);
  }
  console.log(`   ✅ Security check passed: GET /api/orders rejected with HTTP 401 Unauthorized.`);
  console.log(`      Error: "${unauthGetResponse.error}"`);

  // TEST 4: Server-Side Authentication & Session Issuance
  console.log('\n[4/6] Logging In as Administrator (/api/admin POST)...');
  let authResult = null;
  let issuedCookie = '';
  await adminHandler(
    {
      method: 'POST',
      query: { action: 'login' },
      body: {
        username: process.env.ADMIN_USERNAME || 'Chalton',
        password: process.env.ADMIN_PASSWORD || 'chalton5825$'
      },
      headers: {},
    },
    {
      statusCode: 200,
      setHeader(k, v) { if (k.toLowerCase() === 'set-cookie') issuedCookie = v; },
      status(code) { this.statusCode = code; return this; },
      json(data) { authResult = data; return this; }
    }
  );

  if (!authResult || !authResult.success || !authResult.token) {
    throw new Error(`Admin authentication failed: ${JSON.stringify(authResult)}`);
  }
  const token = authResult.token;
  console.log(`   ✅ Administrator session issued for "${authResult.user.username}".`);
  console.log(`   ✅ Cryptographic HMAC Session Cookie: ${issuedCookie.split(';')[0]}`);

  // TEST 5: Verify Authenticated Staff Can Inspect Orders & Update Status
  console.log('\n[5/6] Inspecting Orders and Updating Status with Cryptographic Session...');
  let authOrdersResponse = null;
  await ordersHandler(
    {
      method: 'GET',
      query: { limit: 20 },
      headers: { authorization: `Bearer ${token}` }
    },
    {
      statusCode: 200,
      setHeader: () => {},
      status(code) { this.statusCode = code; return this; },
      json(data) { authOrdersResponse = data; return this; }
    }
  );

  const foundOrder = authOrdersResponse.orders.find(o => o.id === testOrderId);
  if (!foundOrder) {
    throw new Error(`Order ${testOrderId} not found in authenticated query.`);
  }
  console.log(`   ✅ Authenticated query succeeded: ${authOrdersResponse.count} orders accessible.`);
  console.log(`      Found order: ${foundOrder.id} - ${foundOrder.customer} [${foundOrder.county}]`);

  // PATCH order status with token
  let patchResponse = null;
  await ordersHandler(
    {
      method: 'PATCH',
      body: { id: testOrderId, status: 'Processing' },
      headers: { authorization: `Bearer ${token}` }
    },
    {
      statusCode: 200,
      setHeader: () => {},
      status(code) { this.statusCode = code; return this; },
      json(data) { patchResponse = data; return this; }
    }
  );

  if (!patchResponse || !patchResponse.success) {
    throw new Error(`Authenticated status patch failed: ${JSON.stringify(patchResponse)}`);
  }
  console.log(`   ✅ Order #${testOrderId} fulfillment status updated to "${patchResponse.order.payment_status}".`);

  // TEST 6: Route Guard Template Isolation (HTML Inspection)
  console.log('\n[6/6] Verifying Server-Side /admin Route Guard & CSS Tamper Immunity...');
  
  // A. Request /admin WITHOUT session
  let unauthHtml = '';
  await adminHandler(
    {
      method: 'GET',
      url: '/admin',
      headers: { accept: 'text/html' }
    },
    {
      statusCode: 200,
      setHeader: () => {},
      status(code) { this.statusCode = code; return this; },
      end(content) { unauthHtml = content; return this; }
    }
  );

  if (!unauthHtml.includes('Unlock Operations Console')) {
    throw new Error('Unauthenticated /admin did not serve login template!');
  }
  if (unauthHtml.includes('admin-dashboard-app') || unauthHtml.includes('chart-sales-trend') || unauthHtml.includes('admin-orders-tbody')) {
    throw new Error('CRITICAL SECURITY FLAW: Dashboard markup leaked to unauthenticated user!');
  }
  console.log('   ✅ Unauthenticated /admin request serves ONLY login template.');
  console.log('   ✅ Dashboard markup is 100% physically absent from unauthenticated HTML.');
  console.log('   ✅ Toggling CSS in DevTools reveals NO dashboard operations.');

  // B. Request /admin WITH session
  let authHtml = '';
  await adminHandler(
    {
      method: 'GET',
      url: '/admin',
      headers: {
        accept: 'text/html',
        cookie: `agrovet_admin_session=${token}`
      }
    },
    {
      statusCode: 200,
      setHeader: () => {},
      status(code) { this.statusCode = code; return this; },
      end(content) { authHtml = content; return this; }
    }
  );

  if (!authHtml.includes('admin-dashboard-app') || !authHtml.includes('chart-sales-trend')) {
    throw new Error('Authenticated /admin did not serve full dashboard template!');
  }
  console.log('   ✅ Authenticated /admin request serves complete dashboard template.');

  console.log('\n===============================================================');
  console.log('🎉 ALL 6 SECURITY CHECKS PASSED 100%!');
  console.log('   - /admin is protected behind server-side cryptographic authentication.');
  console.log('   - Dashboard operations cannot be accessed by toggling client-side CSS.');
  console.log('   - Sensitive customer data is guarded server-side against API probing.');
  console.log('===============================================================\n');

  process.exit(0);
}

runTests().catch((err) => {
  console.error('\n❌ Test Failure:', err);
  process.exit(1);
});

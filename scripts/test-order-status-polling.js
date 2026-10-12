/**
 * AGROVET LTD — Real-Time Order & Payment Status Polling Test Suite
 * Verifies that:
 * 1. Storefront can poll /api/order-status without admin credentials.
 * 2. Status starts as Pending.
 * 3. Safaricom callback webhook instantly clears the order to Paid with receipt.
 * 4. Polling endpoint immediately reflects the Paid status and receipt code.
 */

const ordersHandler = require('../api/orders');
const callbackHandler = require('../api/mpesa-callback');
const orderStatusHandler = require('../api/order-status');
const { query, ensureSchema, getPool } = require('../api/_db');

async function runTest() {
  console.log('================================================================');
  console.log('🔄 AGROVET LTD — Real-Time Payment Status Polling Verification');
  console.log('================================================================\n');

  await ensureSchema();

  const testOrderId = 'POLL-ORD-' + Math.floor(10000 + Math.random() * 90000);
  const testCheckoutId = 'ws_CO_TEST_POLL_' + Date.now();

  // 1. Create order with Pending STK PIN
  console.log('[1/4] Placing storefront order with pending STK push...');
  let orderCreated = false;
  await ordersHandler(
    {
      method: 'POST',
      body: {
        id: testOrderId,
        customer_name: 'Grace Wambui',
        phone: '0722123456',
        county: 'Murang\'a',
        town: 'Kenol Farm Center',
        delivery_fee: 300,
        subtotal: 4200,
        total: 4500,
        payment_method: 'M-Pesa STK Push',
        payment_status: 'Pending STK PIN',
        checkout_request_id: testCheckoutId,
        items: [{ id: 1, name: 'Belt 480 SC Insecticide', qty: 2, price: 2100 }],
        order_source: 'web'
      }
    },
    {
      statusCode: 200,
      setHeader: () => {},
      status(c) { this.statusCode = c; return this; },
      json(d) { orderCreated = d.success; return this; }
    }
  );

  if (!orderCreated) throw new Error('Failed to create test order.');
  console.log(`   ✅ Order #${testOrderId} created in PostgreSQL with status "Pending STK PIN".`);

  // 2. Poll status before Safaricom callback
  console.log('\n[2/4] Storefront polling /api/order-status before callback...');
  let initialStatus = null;
  await orderStatusHandler(
    {
      method: 'GET',
      query: { id: testOrderId, checkoutRequestId: testCheckoutId }
    },
    {
      statusCode: 200,
      setHeader: () => {},
      status(c) { this.statusCode = c; return this; },
      json(d) { initialStatus = d; return this; }
    }
  );

  if (!initialStatus || !initialStatus.found) throw new Error('Order not found by polling endpoint.');
  if (initialStatus.order.isPaid) throw new Error('Order should NOT be marked Paid yet.');
  if (!initialStatus.order.isPending) throw new Error('Order should be in Pending state.');
  console.log(`   ✅ Polling verified: Order is pending (isPaid=${initialStatus.order.isPaid}, isPending=${initialStatus.order.isPending}).`);

  // 3. Dispatch Safaricom Daraja Webhook
  console.log('\n[3/4] Safaricom posts real-time payment confirmation webhook...');
  const testReceipt = 'QKH' + Math.floor(1000000 + Math.random() * 9000000);
  let callbackAck = null;

  await callbackHandler(
    {
      method: 'POST',
      body: {
        Body: {
          stkCallback: {
            MerchantRequestID: 'M-REQ-1234',
            CheckoutRequestID: testCheckoutId,
            ResultCode: 0,
            ResultDesc: 'The service request is processed successfully.',
            CallbackMetadata: {
              Item: [
                { Name: 'Amount', Value: 4500 },
                { Name: 'MpesaReceiptNumber', Value: testReceipt },
                { Name: 'TransactionDate', Value: 20261012173000 },
                { Name: 'PhoneNumber', Value: 254722123456 }
              ]
            }
          }
        }
      }
    },
    {
      statusCode: 200,
      setHeader: () => {},
      status(c) { this.statusCode = c; return this; },
      json(d) { callbackAck = d; return this; }
    }
  );

  if (!callbackAck || callbackAck.ResultCode !== 0) throw new Error('Callback ACK failed.');
  console.log(`   ✅ Safaricom callback accepted. Receipt: ${testReceipt}`);

  // 4. Poll status after callback
  console.log('\n[4/4] Storefront polling /api/order-status after callback...');
  let updatedStatus = null;
  await orderStatusHandler(
    {
      method: 'GET',
      query: { id: testOrderId, checkoutRequestId: testCheckoutId }
    },
    {
      statusCode: 200,
      setHeader: () => {},
      status(c) { this.statusCode = c; return this; },
      json(d) { updatedStatus = d; return this; }
    }
  );

  if (!updatedStatus || !updatedStatus.order.isPaid) {
    throw new Error('Order did not transition to isPaid=true!');
  }
  if (updatedStatus.order.mpesaCode !== testReceipt) {
    throw new Error(`Receipt mismatch: expected ${testReceipt}, got ${updatedStatus.order.mpesaCode}`);
  }

  console.log(`   ✅ Real-time polling confirmed: isPaid=true, Receipt Code="${updatedStatus.order.mpesaCode}".`);
  console.log(`   ✅ Customer modal successfully unlocks receipt screen!`);

  console.log('\n================================================================');
  console.log('🎉 ALL REAL-TIME POLLING & WEBHOOK TESTS PASSED 100%!');
  console.log('================================================================\n');

  try {
    const pool = getPool();
    if (pool) await pool.end();
  } catch (e) {}

  process.exitCode = 0;
}

runTest().catch((err) => {
  console.error('\n❌ Test Error:', err);
  process.exit(1);
});

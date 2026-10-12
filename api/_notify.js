/**
 * AGROVET LTD (agrovet.ltd) — Transactional Order Notifications & Alerts
 * Dispatches automated, responsive HTML email notifications to merchant
 * administrators (jjjanuaries@gmail.com) and customers via Resend REST API.
 */

/**
 * Generates responsive HTML email template for farm order dispatch
 */
function buildOrderEmailHtml({ order, eventType }) {
  const isPaid = eventType === 'PAYMENT_RECEIVED' || order.payment_status === 'Paid' || order.status === 'Paid';
  const badgeColor = isPaid ? '#10b981' : '#f59e0b';
  const badgeText = isPaid
    ? `✅ PAID VIA M-PESA (${order.mpesa_code || order.mpesaCode || 'CONFIRMED'})`
    : `⏳ ${order.payment_status || order.status || 'PENDING'}`;

  const cleanPhone = String(order.phone || '').replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.startsWith('0') ? '254' + cleanPhone.slice(1) : cleanPhone;
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(`Habari ${order.customer_name || order.customer || 'mkulima'}, pokea salamu kutoka Agrovet Ltd. Kuhusu oda yako #${order.id}...`)}`;

  let itemsHtml = '';
  const items = Array.isArray(order.items)
    ? order.items
    : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);

  if (items.length > 0) {
    itemsHtml = items
      .map(
        (it) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 10px 8px; font-weight: 600; color: #111827;">
            ${it.name || 'Certified Input'}
            ${it.packSize ? `<span style="display: block; font-size: 12px; color: #6b7280; font-weight: normal;">Pack: ${it.packSize}</span>` : ''}
          </td>
          <td style="padding: 10px 8px; text-align: center; color: #374151;">${it.qty || it.quantity || 1}</td>
          <td style="padding: 10px 8px; text-align: right; color: #374151;">KSh ${Number(it.price || 0).toLocaleString()}</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 600; color: #1b4332;">KSh ${(Number(it.price || 0) * Number(it.qty || it.quantity || 1)).toLocaleString()}</td>
        </tr>`
      )
      .join('');
  } else {
    itemsHtml = `<tr><td colspan="4" style="padding: 12px; text-align: center; color: #6b7280;">Farm inputs batch</td></tr>`;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Agrovet Ltd Order #${order.id}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f6f3; color: #1f2937;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); padding: 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">🌾 Agrovet Ltd Kenya</h1>
      <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Certified Seed & Farm Input Logistics Portal</p>
      
      <div style="margin-top: 14px; display: inline-block; background: ${badgeColor}; color: #ffffff; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
        ${badgeText}
      </div>
    </div>

    <!-- Order Meta -->
    <div style="padding: 20px 24px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
      <table style="width: 100%; font-size: 14px;">
        <tr>
          <td style="color: #6b7280; padding: 4px 0;">Order Reference:</td>
          <td style="text-align: right; font-weight: 700; color: #111827;">#${order.id}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 4px 0;">Payment Method:</td>
          <td style="text-align: right; font-weight: 600; color: #111827;">${order.payment_method || order.paymentMethod || 'M-Pesa'}</td>
        </tr>
        ${order.mpesa_code || order.mpesaCode ? `
        <tr>
          <td style="color: #6b7280; padding: 4px 0;">Safaricom Receipt:</td>
          <td style="text-align: right; font-weight: 700; color: #047857;">${order.mpesa_code || order.mpesaCode}</td>
        </tr>` : ''}
        <tr>
          <td style="color: #6b7280; padding: 4px 0;">Grand Total:</td>
          <td style="text-align: right; font-weight: 800; font-size: 16px; color: #1b4332;">KSh ${Number(order.total || 0).toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <!-- Customer & Destination Details -->
    <div style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb;">
      <h3 style="margin: 0 0 12px; font-size: 15px; color: #1b4332; text-transform: uppercase; letter-spacing: 0.5px;">📍 Delivery & Customer Details</h3>
      <table style="width: 100%; font-size: 14px;">
        <tr>
          <td style="color: #6b7280; padding: 4px 0; width: 35%;">Farmer / Client:</td>
          <td style="font-weight: 600; color: #111827;">${order.customer_name || order.customer || 'Customer'}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 4px 0;">Phone Hotline:</td>
          <td style="font-weight: 600; color: #111827;">
            <a href="tel:${order.phone}" style="color: #047857; text-decoration: none;">${order.phone}</a>
          </td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 4px 0;">Dispatch County:</td>
          <td style="font-weight: 600; color: #111827;">${order.county || 'N/A'}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 4px 0;">Pickup / Town Hub:</td>
          <td style="color: #111827;">${order.town || 'Main Town'}</td>
        </tr>
        ${order.address_landmark || order.landmark ? `
        <tr>
          <td style="color: #6b7280; padding: 4px 0;">Delivery Landmark:</td>
          <td style="color: #4b5563;">${order.address_landmark || order.landmark}</td>
        </tr>` : ''}
        ${order.notes ? `
        <tr>
          <td style="color: #6b7280; padding: 4px 0;">Farmer Notes:</td>
          <td style="color: #4b5563; font-style: italic;">"${order.notes}"</td>
        </tr>` : ''}
      </table>
    </div>

    <!-- Itemized Manifest -->
    <div style="padding: 20px 24px;">
      <h3 style="margin: 0 0 12px; font-size: 15px; color: #1b4332; text-transform: uppercase; letter-spacing: 0.5px;">📦 Items to Dispatch</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background: #f9fafb; border-bottom: 2px solid #e5e7eb; color: #4b5563;">
            <th style="padding: 8px; text-align: left;">Product</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Unit</th>
            <th style="padding: 8px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px 8px 4px; text-align: right; color: #6b7280;">Subtotal:</td>
            <td style="padding: 10px 8px 4px; text-align: right; font-weight: 600;">KSh ${Number(order.subtotal || 0).toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 4px 8px; text-align: right; color: #6b7280;">Delivery Fee:</td>
            <td style="padding: 4px 8px; text-align: right; font-weight: 600;">KSh ${Number(order.delivery_fee || order.deliveryFee || 0).toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 8px; text-align: right; font-weight: 800; font-size: 15px; color: #1b4332; border-top: 2px solid #e5e7eb;">Grand Total:</td>
            <td style="padding: 8px; text-align: right; font-weight: 800; font-size: 15px; color: #1b4332; border-top: 2px solid #e5e7eb;">KSh ${Number(order.total || 0).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Quick Actions -->
    <div style="padding: 16px 24px 24px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
      <a href="${waUrl}" style="display: inline-block; background: #25d366; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 18px; border-radius: 6px; margin: 4px 6px;">
        💬 Chat Farmer on WhatsApp
      </a>
      <a href="https://agrovet.ltd/admin" style="display: inline-block; background: #1b4332; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 18px; border-radius: 6px; margin: 4px 6px;">
        📊 Open Admin Portal
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 24px; text-align: center; font-size: 12px; color: #9ca3af; background: #ffffff;">
      Agrovet Ltd Kenya • Kirinyaga Road, Nairobi • Phone: +254 720 263 503 • jjjanuaries@gmail.com<br>
      Licensed Agricultural Distributor (PCPB & KEPHIS Certified)
    </div>

  </div>
</body>
</html>`;
}

/**
 * Dispatches transactional notifications to the merchant admin and customer
 * @param {Object} params
 * @param {Object} params.order - The order entity
 * @param {'ORDER_CREATED' | 'PAYMENT_RECEIVED'} params.eventType
 */
async function sendOrderNotification({ order, eventType = 'ORDER_CREATED' }) {
  if (!order) return { success: false, error: 'No order data provided' };

  const adminEmail = (process.env.ADMIN_NOTIFICATION_EMAIL || 'jjjanuaries@gmail.com').trim();
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const fromEmail = (process.env.EMAIL_FROM || 'Agrovet Ltd <onboarding@resend.dev>').trim();

  const isPaid = eventType === 'PAYMENT_RECEIVED' || order.payment_status === 'Paid' || order.status === 'Paid';
  const subject = isPaid
    ? `💰 [PAID] Order #${order.id} — KSh ${Number(order.total || 0).toLocaleString()} (${order.customer_name || order.customer})`
    : `📦 [NEW ORDER] #${order.id} — KSh ${Number(order.total || 0).toLocaleString()} (${order.county || 'Kenya'})`;

  const html = buildOrderEmailHtml({ order, eventType });

  // 1. If RESEND_API_KEY is configured, dispatch live email via Resend REST API
  if (resendApiKey && !resendApiKey.startsWith('re_123456789')) {
    try {
      const recipients = [adminEmail];
      if (order.email && order.email.includes('@') && !recipients.includes(order.email)) {
        recipients.push(order.email.trim());
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: recipients,
          subject,
          html,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[Notification Email Dispatched] ID: ${data.id} to ${recipients.join(', ')}`);
        return { success: true, emailId: data.id, recipients };
      } else {
        console.warn('[Resend API Error]', data);
        return { success: false, error: data.message || 'Resend API dispatch failed' };
      }
    } catch (err) {
      console.error('[Notification Dispatch Exception]', err.message);
      return { success: false, error: err.message };
    }
  }

  // 2. Fallback simulation (Local / Sandbox / Missing API Key)
  console.log(`[Notification Recorded] ${eventType} alert prepared for Order #${order.id} -> ${adminEmail} (Grand Total: KSh ${order.total})`);
  return {
    success: true,
    simulated: true,
    message: 'Notification formatted and logged. Set RESEND_API_KEY for live email delivery.',
    recipient: adminEmail,
    subject,
  };
}

module.exports = {
  sendOrderNotification,
  buildOrderEmailHtml,
};

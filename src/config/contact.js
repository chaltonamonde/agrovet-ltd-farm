/* ═══════════════════════════════════════════════════════════════════
   AGROVET LTD (agrovet.ltd) — Central Contact & Business Configuration
   Module export for ESM / bundlers / serverless functions
   ═══════════════════════════════════════════════════════════════════ */

const rawTill = (typeof process !== 'undefined' && process.env && process.env.MPESA_TILL_NUMBER)
  || (typeof window !== 'undefined' && (
      window.MPESA_TILL_NUMBER ||
      window.ENV?.MPESA_TILL_NUMBER ||
      window.__ENV__?.MPESA_TILL_NUMBER ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('MPESA_TILL_NUMBER'))
    ));

let resolvedTill = "Till number coming soon";
if (rawTill && String(rawTill).trim() !== "" && String(rawTill).trim() !== "876543") {
  resolvedTill = String(rawTill).trim();
} else {
  console.warn('[Agrovet Config] MPESA_TILL_NUMBER environment variable is missing. Displaying "Till number coming soon".');
}

export const contactConfig = {
  businessName: "Agrovet Ltd",
  domain: "agrovet.ltd",
  phoneDisplay: "+254 720 263 503",
  phoneTel: "+254720263503",
  whatsappNumber: "254720263503",
  email: "jjjanuaries@gmail.com",
  address: "Kirinyaga Rd, Nairobi",
  fullAddress: "Kirinyaga Road, Agricultural Center, Shop No. 12, Nairobi, Kenya",
  tillNumber: resolvedTill,
  hours: "Mon – Sat: 7:00 AM – 6:00 PM | Sun & Holidays: 9:00 AM – 1:00 PM",

  getTelUrl() {
    return `tel:${this.phoneTel}`;
  },

  getMailtoUrl(subject = '', body = '') {
    let url = `mailto:${this.email}`;
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return url;
  },

  getWhatsAppUrl(message = '') {
    const base = `https://wa.me/${this.whatsappNumber}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }
};

export default contactConfig;

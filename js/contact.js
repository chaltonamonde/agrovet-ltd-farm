/* ═══════════════════════════════════════════════════════════════════
   AGROVET LTD (agrovet.ltd) — Central Contact & Business Configuration
   Single source of truth for business details, customer hotlines,
   M-Pesa till settlement credentials, and WhatsApp deep links.
   ═══════════════════════════════════════════════════════════════════ */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node.js / CommonJS
    const config = factory();
    module.exports = config;
    module.exports.AGROVET_CONTACT = config;
    module.exports.default = config;
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else {
    // Browser global
    const config = factory();
    root.AGROVET_CONTACT = config;
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          config.hydrate();
          config.syncWithServer();
        });
      } else {
        config.hydrate();
        config.syncWithServer();
      }
    }
  }
})(typeof self !== 'undefined' ? self : this, function () {
  // Resolve environment variable for MPESA_TILL_NUMBER
  let rawTill = null;
  if (typeof process !== 'undefined' && process.env && process.env.MPESA_TILL_NUMBER) {
    rawTill = process.env.MPESA_TILL_NUMBER;
  } else if (typeof window !== 'undefined') {
    rawTill = window.MPESA_TILL_NUMBER ||
              (window.ENV && window.ENV.MPESA_TILL_NUMBER) ||
              (window.__ENV__ && window.__ENV__.MPESA_TILL_NUMBER) ||
              (typeof localStorage !== 'undefined' && localStorage.getItem('MPESA_TILL_NUMBER'));
  }

  let tillNumber = "1755724";
  let hasTillNumber = true;
  if (rawTill && String(rawTill).trim() !== "" && String(rawTill).trim() !== "876543") {
    tillNumber = String(rawTill).trim();
    hasTillNumber = true;
  }

  const AGROVET_CONTACT = {
    businessName: "Agrovet Ltd",
    domain: "agrovet.ltd",
    phoneDisplay: "+254 110 677 149",
    phoneTel: "+254110677149",
    whatsappNumber: "254110677149",
    email: "chaltononyango5@gmail.com",
    address: "Kirinyaga Rd, Nairobi",
    fullAddress: "Kirinyaga Road, Agricultural Center, Shop No. 12, Nairobi, Kenya",
    tillNumber: tillNumber,
    hasTillNumber: hasTillNumber,
    hours: "Mon – Sat: 7:00 AM – 6:00 PM | Sun & Holidays: 9:00 AM – 1:00 PM",

    // URL formatting helpers
    getTelUrl: function () {
      return "tel:" + this.phoneTel;
    },

    getMailtoUrl: function (subject, body) {
      let url = "mailto:" + this.email;
      const params = [];
      if (subject) params.push("subject=" + encodeURIComponent(subject));
      if (body) params.push("body=" + encodeURIComponent(body));
      if (params.length > 0) url += "?" + params.join("&");
      return url;
    },

    getWhatsAppUrl: function (message) {
      const base = "https://wa.me/" + this.whatsappNumber;
      if (!message) return base;
      return base + "?text=" + encodeURIComponent(message);
    },

    // DOM Hydration helper to update annotated elements
    hydrate: function (rootEl) {
      const doc = rootEl || (typeof document !== 'undefined' ? document : null);
      if (!doc) return;

      // Update text bindings
      doc.querySelectorAll('[data-contact]').forEach(el => {
        const key = el.getAttribute('data-contact');
        if (key && AGROVET_CONTACT[key] !== undefined) {
          el.textContent = AGROVET_CONTACT[key];
        }
      });

      // Update href bindings
      doc.querySelectorAll('[data-contact-href]').forEach(el => {
        const type = el.getAttribute('data-contact-href');
        if (type === 'tel') {
          el.href = AGROVET_CONTACT.getTelUrl();
        } else if (type === 'whatsapp') {
          const prefill = el.getAttribute('data-contact-wa-text');
          el.href = AGROVET_CONTACT.getWhatsAppUrl(prefill || '');
        } else if (type === 'email') {
          const subj = el.getAttribute('data-contact-email-subject');
          el.href = AGROVET_CONTACT.getMailtoUrl(subj || '');
        }
      });

      // Update Till displays specifically
      doc.querySelectorAll('.contact-till-num, #checkout-till-display').forEach(el => {
        el.textContent = AGROVET_CONTACT.tillNumber;
      });
    },

    // Sync live configuration dynamically from /api/public-config
    syncWithServer: function () {
      if (typeof fetch === 'undefined') return;
      fetch('/api/public-config')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (!data || !data.success) return;
          if (data.tillNumber) {
            AGROVET_CONTACT.tillNumber = data.tillNumber;
            AGROVET_CONTACT.hasTillNumber = Boolean(data.hasTillNumber);
          }
          if (data.phoneDisplay) AGROVET_CONTACT.phoneDisplay = data.phoneDisplay;
          if (data.whatsappNumber) AGROVET_CONTACT.whatsappNumber = data.whatsappNumber;
          if (data.email) AGROVET_CONTACT.email = data.email;
          if (data.darajaEnv) AGROVET_CONTACT.darajaEnv = data.darajaEnv;
          AGROVET_CONTACT.hydrate();
        })
        .catch(() => {});
    }
  };

  return AGROVET_CONTACT;
});

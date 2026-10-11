import type { Metadata } from 'next';
import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Agrovet Ltd — visit our shop in Nairobi, call us, WhatsApp our agronomist or send us an email. We respond within minutes during business hours.',
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <p className="label-caps text-leaf mb-2">We are here to help</p>
        <h1 className="font-heading text-5xl font-bold text-forest">Contact Agrovet Ltd</h1>
        <p className="text-idle text-sm mt-3 max-w-xl mx-auto">
          Visit our shop, call us, or chat with our agronomist on WhatsApp. We respond within minutes during business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: info */}
        <div className="space-y-6">
          {/* WhatsApp */}
          <a
            href="https://wa.me/254700000000?text=Hi%20Agrovet%20Ltd!%20I%20need%20some%20help."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-[#E7F9EE] rounded-2xl border border-[#C3EDD4] hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-full bg-whatsapp flex items-center justify-center shrink-0">
              <MessageCircle size={24} className="text-white"/>
            </div>
            <div>
              <p className="font-heading font-bold text-forest text-lg group-hover:text-leaf transition-colors">WhatsApp Agronomist</p>
              <p className="text-sm text-idle">[WHATSAPP] — fastest response</p>
            </div>
          </a>

          {/* Phone */}
          <div className="p-5 card">
            <div className="flex items-center gap-3 mb-4">
              <Phone size={18} className="text-leaf"/>
              <h3 className="font-heading font-bold text-forest text-lg">Call Us</h3>
            </div>
            <a href="tel:[PHONE]" className="block text-ink-green hover:text-leaf text-sm mb-2">[PHONE]</a>
            <a href="tel:[PHONE2]" className="block text-ink-green hover:text-leaf text-sm">[PHONE 2]</a>
          </div>

          {/* Address & hours */}
          <div className="p-5 card">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={18} className="text-leaf"/>
              <h3 className="font-heading font-bold text-forest text-lg">Visit Our Shop</h3>
            </div>
            <p className="text-sm text-ink-green mb-3">[ADDRESS], Nairobi, Kenya</p>
            <div className="flex items-start gap-3 text-sm text-idle">
              <Clock size={16} className="text-leaf shrink-0 mt-0.5"/>
              <div>
                <p>Monday – Saturday: <strong className="text-ink-green">7:00 am – 6:00 pm</strong></p>
                <p>Sundays & Public Holidays: <strong className="text-ink-green">9:00 am – 1:00 pm</strong></p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="h-48 bg-pale rounded-2xl flex items-center justify-center text-idle text-sm border border-idle">
            📍 Google Map will be embedded here
          </div>
        </div>

        {/* Right: contact form */}
        <div className="card p-6">
          <h2 className="font-heading text-2xl font-bold text-forest mb-6">Send Us a Message</h2>
          <form className="space-y-4" aria-label="Contact form">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-ink-green mb-1.5">Your Name *</label>
              <input
                id="name" type="text" required autoComplete="name"
                placeholder="e.g. John Kamau"
                className="w-full border border-idle rounded-xl px-4 py-3 text-sm outline-none focus:border-leaf bg-card transition-colors"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-ink-green mb-1.5">Phone / WhatsApp *</label>
              <input
                id="phone" type="tel" required autoComplete="tel"
                placeholder="e.g. 0712 345 678"
                className="w-full border border-idle rounded-xl px-4 py-3 text-sm outline-none focus:border-leaf bg-card transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink-green mb-1.5">Email (optional)</label>
              <input
                id="email" type="email" autoComplete="email"
                placeholder="e.g. john@example.com"
                className="w-full border border-idle rounded-xl px-4 py-3 text-sm outline-none focus:border-leaf bg-card transition-colors"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-ink-green mb-1.5">Message *</label>
              <textarea
                id="message" required rows={4}
                placeholder="Tell us about your farm, crop problem, or what products you need…"
                className="w-full border border-idle rounded-xl px-4 py-3 text-sm outline-none focus:border-leaf bg-card transition-colors resize-none"
              />
            </div>
            <p className="text-xs text-idle">
              By submitting this form you agree to our <a href="/privacy" className="text-leaf hover:underline">Privacy Policy</a>.
              We will not share your details with third parties.
            </p>
            <button type="submit" className="btn-leaf w-full py-3.5 text-sm font-bold">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

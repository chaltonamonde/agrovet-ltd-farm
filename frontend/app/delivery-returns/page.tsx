import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delivery & Returns',
  description: 'Agrovet Ltd delivery rates, timelines, pickup options and returns policy for all farm input orders across Kenya.',
};

export default function DeliveryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <h1 className="font-heading text-5xl font-bold text-forest mb-3">Delivery & Returns</h1>
      <p className="text-idle text-sm mb-10">Last updated: October 2026</p>

      <div className="space-y-8 text-sm text-ink-green leading-relaxed">
        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">Delivery Areas</h2>
          <p>We deliver to all 47 counties in Kenya via road courier and parcel services. Delivery rates vary by county, distance and parcel weight.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">Estimated Delivery Rates</h2>
          <div className="bg-pale rounded-2xl p-5">
            <p className="text-xs text-idle mb-4 italic">Rates below are indicative. Final delivery cost is calculated at checkout.</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-idle text-left">
                  <th className="pb-2 font-semibold text-ink-green">Area</th>
                  <th className="pb-2 font-semibold text-ink-green">Rate from</th>
                  <th className="pb-2 font-semibold text-ink-green">Timeline</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {[
                  ['Nairobi',              '[DELIVERY RATES]', 'Same day / Next day'],
                  ['Central Kenya',        '[DELIVERY RATES]', '1–2 working days'],
                  ['Rift Valley',          '[DELIVERY RATES]', '2–3 working days'],
                  ['Western Kenya',        '[DELIVERY RATES]', '2–4 working days'],
                  ['Coast & Other Counties','[DELIVERY RATES]', '3–5 working days'],
                ].map(([area, rate, timeline]) => (
                  <tr key={area} className="border-b border-pale/50">
                    <td className="py-2">{area}</td>
                    <td className="py-2 text-leaf font-semibold">{rate}</td>
                    <td className="py-2 text-idle">{timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">Free Delivery</h2>
          <p>Orders above KSh 5,000 qualify for free delivery within Nairobi County. Terms may apply for heavy or bulky items.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">Pickup from Shop</h2>
          <p>You can pick up your order free of charge from our shop at <strong>[ADDRESS]</strong>, Nairobi. Select &quot;Pick up from shop&quot; at checkout. Your order will be ready within 2 hours of confirmation.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">Returns Policy</h2>
          <ul className="space-y-2 list-disc pl-5 text-idle">
            <li>Unopened, undamaged products can be returned within <strong className="text-ink-green">7 days</strong> of delivery.</li>
            <li>Agrochemicals cannot be returned once opened, for safety and regulatory reasons.</li>
            <li>To initiate a return, contact us on WhatsApp [WHATSAPP] or email [EMAIL] with your order number and reason.</li>
            <li>Refunds are processed within 3–5 business days of receiving the returned item.</li>
          </ul>
        </section>

        <div className="bg-forest rounded-2xl p-6 text-center text-white">
          <p className="font-heading text-2xl font-bold mb-2">Questions about delivery?</p>
          <p className="text-pale text-sm mb-5">Our team responds within minutes on WhatsApp during business hours.</p>
          <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="btn-gold px-6 py-2.5 text-sm font-bold inline-block">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

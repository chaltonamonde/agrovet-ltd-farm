import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Agrovet Ltd Privacy Policy — how we collect, use and protect your personal data in compliance with the Kenya Data Protection Act 2019.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <h1 className="font-heading text-5xl font-bold text-forest mb-3">Privacy Policy</h1>
      <p className="text-idle text-sm mb-10">Last updated: October 2026 — In compliance with the Kenya Data Protection Act 2019</p>

      <div className="space-y-8 text-sm text-ink-green leading-relaxed prose prose-sm max-w-none">
        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">1. Who We Are</h2>
          <p>Agrovet Ltd (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is a farm inputs company registered in Kenya, operating at [ADDRESS], Nairobi. We are committed to protecting your personal data in accordance with the Kenya Data Protection Act 2019.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">2. Data We Collect</h2>
          <p>When you use our website or place an order, we may collect:</p>
          <ul className="list-disc pl-5 space-y-1 text-idle mt-3">
            <li>Name, phone number, email address and delivery address</li>
            <li>Order history and product preferences</li>
            <li>M-Pesa payment confirmation details (reference numbers only — not your PIN)</li>
            <li>Device type, browser and approximate location (for delivery rate calculation)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">3. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1 text-idle mt-3">
            <li>To process and fulfil your orders</li>
            <li>To send order status updates via SMS or WhatsApp</li>
            <li>To respond to your enquiries and provide agronomist support</li>
            <li>To send marketing messages (only with your explicit consent)</li>
            <li>To improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">4. Data Sharing</h2>
          <p>We do not sell your personal data. We only share your data with:</p>
          <ul className="list-disc pl-5 space-y-1 text-idle mt-3">
            <li>Delivery partners, to fulfil your order</li>
            <li>Payment processors (Safaricom M-Pesa), for payment processing only</li>
            <li>Government authorities, if required by Kenyan law</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">5. Your Rights</h2>
          <p>Under the Kenya Data Protection Act 2019, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 text-idle mt-3">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
            <li>Withdraw consent for marketing messages at any time</li>
            <li>Lodge a complaint with the Office of the Data Protection Commissioner (ODPC)</li>
          </ul>
          <p className="mt-3">To exercise your rights, contact us at: <a href="mailto:[EMAIL]" className="text-leaf hover:underline">[EMAIL]</a></p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">6. Cookies</h2>
          <p>We use essential cookies only (for your shopping cart and session). We do not use advertising or tracking cookies without your consent.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-forest mb-3">7. Contact</h2>
          <p>Data Controller: Agrovet Ltd<br/>Address: [ADDRESS], Nairobi, Kenya<br/>Email: <a href="mailto:[EMAIL]" className="text-leaf hover:underline">[EMAIL]</a><br/>Phone: [PHONE]</p>
        </section>
      </div>
    </div>
  );
}

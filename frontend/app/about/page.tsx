import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, MessageCircle, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Agrovet Ltd — your trusted Nairobi-based farm inputs supplier. PCPB-registered, genuine products, expert agronomist support.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Hero */}
      <div className="hero-gradient rounded-3xl p-10 md:p-14 text-white text-center mb-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gold blur-3xl"/>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-leaf blur-2xl"/>
        </div>
        <p className="label-caps text-gold mb-3">Your farm partner</p>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">About Agrovet Ltd</h1>
        <p className="text-pale max-w-2xl mx-auto text-base leading-relaxed">
          We are a Nairobi-based agrovet shop dedicated to providing Kenyan farmers with genuine,
          certified farm inputs — at fair prices, with honest advice and fast delivery.
        </p>
      </div>

      {/* Story */}
      <section className="mb-14">
        <h2 className="font-heading text-3xl font-bold text-forest mb-5">Our Story</h2>
        <div className="space-y-4 text-sm text-ink-green leading-relaxed">
          <p>
            Agrovet Ltd was founded with one goal: to make quality farm inputs accessible to every farmer in Kenya —
            from smallholder kitchen gardeners in Kiambu to large-scale commercial farmers in the Rift Valley.
          </p>
          <p>
            We stock only PCPB-registered agrochemicals sourced from licensed suppliers. No counterfeits, no expired stock.
            Every product on our shelves has a genuine manufacturer seal and a valid registration number.
          </p>
          <p>
            Our in-house agronomist is available on WhatsApp and phone to give you free, practical advice on crop
            problems, chemical selection and application techniques. We believe farmers deserve real answers, not guesswork.
          </p>
        </div>
      </section>

      {/* Trust signals */}
      <section className="grid sm:grid-cols-3 gap-5 mb-14">
        {[
          { icon: Shield, title: 'PCPB Registered',     desc: 'We are a licensed agrochemical dealer. Licence No.: [PCPB LICENCE NO.]', colour: 'text-leaf' },
          { icon: MapPin, title: 'Physical Shop',        desc: 'Visit us at [ADDRESS], Nairobi. Mon–Sat 7am–6pm.',                     colour: 'text-gold' },
          { icon: MessageCircle, title: 'Agronomist Support', desc: 'Free agronomist advice via WhatsApp: [WHATSAPP]',                  colour: 'text-leaf' },
        ].map(({ icon: Icon, title, desc, colour }) => (
          <div key={title} className="card p-6 text-center">
            <Icon size={28} className={`${colour} mx-auto mb-3`}/>
            <h3 className="font-heading font-bold text-forest text-xl mb-2">{title}</h3>
            <p className="text-xs text-idle leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Contact info */}
      <section className="bg-pale rounded-3xl p-8 mb-10">
        <h2 className="font-heading text-3xl font-bold text-forest mb-6">Find Us</h2>
        <div className="grid sm:grid-cols-2 gap-5 text-sm">
          <div className="space-y-4">
            <p className="flex items-start gap-3 text-ink-green">
              <MapPin size={18} className="text-leaf shrink-0 mt-0.5"/> [ADDRESS], Nairobi, Kenya
            </p>
            <p className="flex items-center gap-3 text-ink-green">
              <Phone size={18} className="text-leaf"/> <a href="tel:[PHONE]" className="hover:text-leaf">[PHONE]</a>
            </p>
            <p className="flex items-center gap-3 text-ink-green">
              <Mail size={18} className="text-leaf"/> <a href="mailto:[EMAIL]" className="hover:text-leaf">[EMAIL]</a>
            </p>
            <p className="flex items-start gap-3 text-ink-green">
              <Clock size={18} className="text-leaf shrink-0 mt-0.5"/>
              <span>Mon–Sat: 7:00 am – 6:00 pm<br/>Sun & Holidays: 9:00 am – 1:00 pm</span>
            </p>
          </div>
          {/* Map placeholder */}
          <div className="bg-idle/20 rounded-2xl h-48 flex items-center justify-center text-idle text-sm">
            📍 Google Map will be embedded here
          </div>
        </div>
      </section>

      <div className="text-center">
        <Link href="/shop" className="btn-leaf px-8 py-3.5 text-sm font-bold inline-block mr-3">Shop Now</Link>
        <Link href="/contact" className="btn-outline-white bg-forest text-white rounded-full px-8 py-3.5 text-sm font-semibold inline-block">Contact Us</Link>
      </div>
    </div>
  );
}

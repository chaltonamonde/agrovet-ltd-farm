import { Truck, CheckCircle, BadgeDollarSign, HeadphonesIcon } from 'lucide-react';

const pillars = [
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    desc:  'We deliver to every county in Kenya — from Nairobi to Turkana.',
    colour: 'text-leaf',
  },
  {
    icon: CheckCircle,
    title: 'Genuine Farm Inputs',
    desc:  'PCPB-registered, certified products from licensed suppliers.',
    colour: 'text-gold',
  },
  {
    icon: BadgeDollarSign,
    title: 'Competitive Prices',
    desc:  'Fair, transparent pricing with wholesale rates for bulk buyers.',
    colour: 'text-leaf',
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Agronomist Support',
    desc:  'Chat with our in-house agronomist on WhatsApp — free advice.',
    colour: 'text-gold',
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-card py-8 border-b border-pale" aria-label="Why shop with us">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map(({ icon: Icon, title, desc, colour }) => (
            <div
              key={title}
              className="flex items-start gap-4 group"
            >
              <div className={`shrink-0 w-11 h-11 rounded-xl bg-pale flex items-center justify-center group-hover:scale-110 transition-transform ${colour}`}>
                <Icon size={22}/>
              </div>
              <div>
                <h3 className="font-semibold text-ink-green text-sm leading-tight mb-1">{title}</h3>
                <p className="text-xs text-idle leading-relaxed hidden sm:block">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CheckCircle } from 'lucide-react';

const checkmarks = [
  'PCPB-registered agrochemicals from licensed suppliers',
  'Wholesale prices for bulk buyers and farmer groups',
  'Fast nationwide delivery with order tracking',
];

export default function PromoBanner() {
  return (
    <section
      className="py-16 hero-gradient relative overflow-hidden"
      aria-labelledby="promo-heading"
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-leaf/10 blur-3xl"/>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold/10 blur-2xl"/>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left text */}
          <div className="flex-1">
            <p className="label-caps text-gold mb-3">Your farm. Your future.</p>
            <h2 id="promo-heading" className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-none mb-6">
              Grow More with<br/>
              <span className="text-gold">Quality</span> Farm Inputs
            </h2>

            <ul className="space-y-3 mb-8">
              {checkmarks.map(text => (
                <li key={text} className="flex items-start gap-3 text-pale text-sm">
                  <CheckCircle size={18} className="text-leaf-2 shrink-0 mt-0.5"/>
                  {text}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn-gold px-7 py-3 text-sm font-bold inline-flex items-center gap-2">
                Shop Farm Inputs <ArrowRight size={16}/>
              </Link>
              <Link href="/contact" className="btn-outline-white px-7 py-3 text-sm font-semibold inline-block">
                Request a Quote
              </Link>
            </div>
          </div>

          {/* Right decorative card */}
          <div className="flex-shrink-0 w-full max-w-sm lg:max-w-xs">
            <div className="bg-card/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <div className="text-center mb-5">
                <div className="text-5xl mb-3">🌾</div>
                <p className="font-heading text-2xl font-bold text-white">Better Yields.</p>
                <p className="font-heading text-2xl font-bold text-gold">Better Income.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🌿', label: 'Crop Protection' },
                  { icon: '🌱', label: 'Seeds' },
                  { icon: '💊', label: 'Fertilizers' },
                  { icon: '🔧', label: 'Farm Tools' },
                ].map(item => (
                  <div key={item.label} className="bg-card/10 rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <p className="text-xs text-pale font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

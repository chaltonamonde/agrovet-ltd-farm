import Link from 'next/link';
import AgrovetLogo from '@/components/common/AgrovetLogo';
import { Phone, Mail, MapPin, Clock, Shield, Truck, Star, MessageCircle } from 'lucide-react';

const shopLinks = [
  { label: 'Herbicides',        href: '/category/herbicides' },
  { label: 'Insecticides',      href: '/category/insecticides' },
  { label: 'Fungicides',        href: '/category/fungicides' },
  { label: 'Seeds',             href: '/category/seeds' },
  { label: 'Fertilizers',       href: '/category/granular-fertilizers' },
  { label: 'Farm Tools',        href: '/category/farm-tools' },
  { label: 'Planting Media',    href: '/category/planting-media' },
];

const cropLinks = [
  { label: 'Miticides / Acaricides', href: '/category/miticides' },
  { label: 'Nematicides',            href: '/category/nematicides' },
  { label: 'Bio-insecticides',       href: '/category/bio-insecticides' },
  { label: 'Adjuvants',              href: '/category/adjuvants' },
  { label: 'Seed Dressing',          href: '/category/seed-dressing' },
  { label: 'Soil Fumigants',         href: '/category/soil-fumigants' },
  { label: 'Termiticides',           href: '/category/termiticides' },
];

export default function Footer() {
  return (
    <footer className="bg-forest text-white mt-20" aria-label="Site footer">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand column */}
        <div>
          <AgrovetLogo variant="full" light className="h-12 w-auto mb-5"/>
          <p className="text-sm text-pale leading-relaxed mb-5">
            Your trusted partner for quality farm inputs in Kenya. We supply certified
            agrochemicals, seeds, fertilizers and tools — delivered to your farm.
          </p>
          <p className="text-xs text-idle leading-relaxed mb-3">
            PCPB Dealer Licence: <strong className="text-gold">[PCPB LICENCE NO.]</strong>
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://wa.me/[WHATSAPP]" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-whatsapp flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label="WhatsApp">
              <MessageCircle size={18}/>
            </a>
            <a href="tel:[PHONE]"
              className="w-9 h-9 rounded-full bg-card/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Call us">
              <Phone size={16}/>
            </a>
            <a href="mailto:[EMAIL]"
              className="w-9 h-9 rounded-full bg-card/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Email us">
              <Mail size={16}/>
            </a>
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h3 className="font-heading text-xl font-bold text-gold mb-4 uppercase tracking-wide">Shop</h3>
          <ul className="space-y-2">
            {shopLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href}
                  className="text-sm text-pale hover:text-white transition-colors hover:pl-1 duration-200 inline-block">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Crop protection links */}
        <div>
          <h3 className="font-heading text-xl font-bold text-gold mb-4 uppercase tracking-wide">Crop Protection</h3>
          <ul className="space-y-2">
            {cropLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href}
                  className="text-sm text-pale hover:text-white transition-colors hover:pl-1 duration-200 inline-block">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Info */}
        <div>
          <h3 className="font-heading text-xl font-bold text-gold mb-4 uppercase tracking-wide">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-pale">
              <MapPin size={16} className="text-leaf-2 shrink-0 mt-0.5"/>
              <span>[ADDRESS], Nairobi, Kenya</span>
            </li>
            <li>
              <a href="tel:[PHONE]" className="flex items-center gap-3 text-sm text-pale hover:text-white transition-colors">
                <Phone size={16} className="text-leaf-2"/> [PHONE]
              </a>
            </li>
            <li>
              <a href="tel:[PHONE2]" className="flex items-center gap-3 text-sm text-pale hover:text-white transition-colors">
                <Phone size={16} className="text-leaf-2"/> [PHONE 2]
              </a>
            </li>
            <li>
              <a href="mailto:[EMAIL]" className="flex items-center gap-3 text-sm text-pale hover:text-white transition-colors">
                <Mail size={16} className="text-leaf-2"/> [EMAIL]
              </a>
            </li>
            <li className="flex items-start gap-3 text-sm text-pale">
              <Clock size={16} className="text-leaf-2 shrink-0 mt-0.5"/>
              <span>Mon–Sat: 7am–6pm<br/>Sun & Holidays: 9am–1pm</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-wrap items-center justify-center gap-6 text-xs text-idle">
          <span className="flex items-center gap-2"><Truck size={14} className="text-leaf-2"/> Nationwide Delivery</span>
          <span className="flex items-center gap-2"><Shield size={14} className="text-leaf-2"/> PCPB Registered</span>
          <span className="flex items-center gap-2"><Star size={14} className="text-leaf-2"/> Genuine Products</span>
          <span className="flex items-center gap-2">🇰🇪 Proudly Kenyan</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-idle">
          <p>© {new Date().getFullYear()} Agrovet Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/delivery-returns" className="hover:text-white transition-colors">Delivery & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

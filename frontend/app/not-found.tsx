import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl mb-6">🌾</div>
      <h1 className="font-heading text-6xl font-bold text-forest mb-3">404</h1>
      <h2 className="font-heading text-2xl font-bold text-ink-green mb-4">Page Not Found</h2>
      <p className="text-idle text-sm mb-8 max-w-md">
        Looks like this page took a walk in the shamba and got lost!
        Let&apos;s get you back on track.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn-leaf px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">
          <Home size={16}/> Back to Home
        </Link>
        <Link href="/shop" className="btn-gold px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">
          <Search size={16}/> Browse Products
        </Link>
      </div>
    </div>
  );
}

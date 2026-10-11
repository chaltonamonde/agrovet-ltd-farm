'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, ShoppingCart, User, Menu, X, Phone,
  MapPin, ChevronDown, Heart, Globe
} from 'lucide-react';
import AgrovetLogo from '@/components/common/AgrovetLogo';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LangContext';
import { categories } from '@/data/mockData';
import { cn, formatKsh } from '@/lib/utils';
import CartDrawer from '@/components/cart/CartDrawer';

const navLinks = [
  { label: 'Home',             href: '/' },
  { label: 'About Us',         href: '/about' },
  { label: 'Browse Categories',href: '/shop', hasDropdown: true },
  { label: 'Shop Now',         href: '/shop' },
  { label: 'Blog & Articles',  href: '/blog' },
  { label: 'Contact Us',       href: '/contact' },
];

export default function Header() {
  const { totalItems, subtotal } = useCart();
  const { lang, toggle } = useLang();
  const router = useRouter();

  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [cartOpen,       setCartOpen]       = useState(false);
  const [megaOpen,       setMegaOpen]       = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [scrolled,       setScrolled]       = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  return (
    <>
      {/* ── Top Utility Bar ────────────────────────────────────────────────── */}
      <div className="hidden md:flex items-center justify-between bg-forest text-white text-xs px-6 py-1.5">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
          Nationwide delivery across Kenya — Piga order leo, tuwasilishe haraka!
        </span>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-pale">
            <MapPin size={13}/> [ADDRESS], Nairobi
          </span>
          <a href="tel:[PHONE]" className="flex items-center gap-1.5 text-gold hover:text-white transition-colors">
            <Phone size={13}/> [PHONE]
          </a>
          <button
            onClick={toggle}
            className="flex items-center gap-1 text-pale hover:text-gold transition-colors"
            aria-label="Toggle language"
          >
            <Globe size={13}/> {lang === 'en' ? 'Swahili' : 'English'}
          </button>
        </div>
      </div>

      {/* ── Main Desktop Header ────────────────────────────────────────────── */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full bg-white transition-shadow duration-300',
          scrolled ? 'shadow-md' : 'shadow-sm border-b border-pale'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Desktop main bar */}
          <div className="hidden md:flex items-center gap-4 py-3">
            {/* Logo */}
            <Link href="/" className="shrink-0" aria-label="Agrovet Ltd home">
              <AgrovetLogo variant="full" className="h-11 w-auto" />
            </Link>

            {/* All Categories button */}
            <div ref={megaRef} className="relative">
              <button
                onClick={() => setMegaOpen(v => !v)}
                className="flex items-center gap-2 bg-forest text-white rounded-full px-4 py-2.5 text-sm font-semibold hover:bg-forest-2 transition-colors"
              >
                <Menu size={16}/> All Categories <ChevronDown size={14} className={cn('transition-transform', megaOpen && 'rotate-180')}/>
              </button>
              {megaOpen && <MegaMenu onClose={() => setMegaOpen(false)} />}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="flex items-center bg-pale rounded-full overflow-hidden border border-idle focus-within:border-leaf focus-within:bg-card transition-all">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search herbicides, seeds, fertilizers…"
                  className="flex-1 bg-transparent px-5 py-2.5 text-sm outline-none placeholder:text-idle"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="btn-leaf px-5 py-2.5 text-sm"
                  aria-label="Search"
                >
                  <Search size={18}/>
                </button>
              </div>
            </form>

            {/* Help */}
            <a href="tel:[PHONE]" className="hidden lg:flex flex-col text-xs text-ink-green shrink-0">
              <span className="text-idle font-normal">Need help?</span>
              <span className="font-semibold text-forest">[PHONE]</span>
            </a>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <Link href="/account" className="p-2 rounded-full hover:bg-pale transition-colors" aria-label="My account">
                <User size={22} className="text-ink-green"/>
              </Link>
              <Link href="/account/wishlist" className="p-2 rounded-full hover:bg-pale transition-colors" aria-label="Wishlist">
                <Heart size={22} className="text-ink-green"/>
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 bg-forest text-white rounded-full px-4 py-2 ml-1 hover:bg-forest-2 transition-colors"
                aria-label={`Cart — ${totalItems} items`}
              >
                <ShoppingCart size={18}/>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-forest text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ animation: 'pulse-badge 2s ease-in-out infinite' }}>
                    {totalItems}
                  </span>
                )}
                <span className="text-sm font-semibold hidden lg:inline">{formatKsh(subtotal)}</span>
              </button>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0 border-t border-pale py-0.5" aria-label="Main navigation">
            {navLinks.map(link => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="px-4 py-2.5 text-sm font-medium text-ink-green hover:text-leaf transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-leaf scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          {/* Mobile Bar */}
          <div className="flex md:hidden items-center justify-between py-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-pale transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} className="text-forest"/>
            </button>
            <Link href="/" aria-label="Agrovet Ltd home">
              <AgrovetLogo variant="full" className="h-9 w-auto"/>
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/account" className="p-2 rounded-full hover:bg-pale" aria-label="Account">
                <User size={22} className="text-forest"/>
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-pale"
                aria-label="Cart"
              >
                <ShoppingCart size={22} className="text-forest"/>
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-gold text-forest text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-pale rounded-full overflow-hidden border border-idle">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search farm inputs…"
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-idle"
                  aria-label="Search products"
                />
                <button type="submit" className="btn-leaf px-4 py-2.5" aria-label="Search">
                  <Search size={18}/>
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <MobileDrawer onClose={() => setMobileOpen(false)} lang={lang} toggleLang={toggle} />
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

// ── Mega Menu ────────────────────────────────────────────────────────────────
function MegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-full left-0 mt-2 w-[640px] bg-card rounded-2xl shadow-2xl border border-pale p-6 grid grid-cols-2 gap-4 z-50 animate-fade-in">
      {categories.map(cat => (
        <div key={cat.slug}>
          <Link
            href={`/category/${cat.slug}`}
            onClick={onClose}
            className="flex items-center gap-2 font-heading font-bold text-forest text-base hover:text-leaf transition-colors mb-2"
          >
            <span>{cat.icon}</span> {cat.name}
          </Link>
          {cat.children?.slice(0, 5).map(sub => (
            <Link
              key={sub.slug}
              href={`/category/${sub.slug}`}
              onClick={onClose}
              className="block text-sm text-ink-green hover:text-leaf py-0.5 pl-6 transition-colors"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Mobile Drawer ────────────────────────────────────────────────────────────
function MobileDrawer({ onClose, lang, toggleLang }: { onClose: () => void; lang: string; toggleLang: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={onClose} aria-hidden/>
      <aside className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-card z-50 flex flex-col shadow-2xl animate-slide-in-left">
        <div className="flex items-center justify-between p-4 border-b border-pale bg-forest">
          <AgrovetLogo variant="full" light className="h-9 w-auto"/>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-card/20 transition-colors" aria-label="Close menu">
            <X size={22} className="text-white"/>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between py-3 border-b border-pale text-ink-green font-medium hover:text-leaf transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4">
            <p className="label-caps text-idle mb-3">Browse Categories</p>
            {categories.map(cat => (
              <div key={cat.slug} className="mb-3">
                <Link
                  href={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-2 font-semibold text-forest hover:text-leaf py-1.5"
                >
                  {cat.icon} {cat.name}
                </Link>
                {cat.children?.map(sub => (
                  <Link
                    key={sub.slug}
                    href={`/category/${sub.slug}`}
                    onClick={onClose}
                    className="block text-sm text-ink-green hover:text-leaf pl-6 py-1"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-pale bg-pale space-y-3">
          <a href="tel:[PHONE]" className="flex items-center gap-3 text-forest font-semibold">
            <Phone size={18} className="text-leaf"/> [PHONE]
          </a>
          <button onClick={toggleLang} className="flex items-center gap-2 text-sm text-ink-green">
            <Globe size={16} className="text-leaf"/> Switch to {lang === 'en' ? 'Swahili' : 'English'}
          </button>
        </div>
      </aside>
    </>
  );
}

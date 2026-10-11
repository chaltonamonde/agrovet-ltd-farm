'use client';
import Link from 'next/link';
import { Home, Grid3x3, Search, User, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Home',       href: '/',          icon: Home },
  { label: 'Categories', href: '/shop',       icon: Grid3x3 },
  { label: 'Search',     href: '/shop',       icon: Search },
  { label: 'Account',    href: '/account',    icon: User },
  { label: 'Cart',       href: '/cart',       icon: ShoppingCart, showBadge: true },
];

export default function MobileTabBar() {
  const { totalItems } = useCart();
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-card border-t border-pale safe-area-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around h-16">
        {tabs.map(({ label, href, icon: Icon, showBadge }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 relative transition-colors',
                isActive ? 'text-leaf' : 'text-idle'
              )}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8}/>
                {showBadge && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-forest text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium leading-none">{label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-leaf rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

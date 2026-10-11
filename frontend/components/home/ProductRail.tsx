'use client';
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import type { Product } from '@/types';

interface ProductRailProps {
  title: string;
  label?: string;
  products: Product[];
  viewAllHref?: string;
  bgClass?: string;
}

export default function ProductRail({ title, label, products, viewAllHref = '/shop', bgClass = "bg-card" }: ProductRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  return (
    <section className={`py-14 ${bgClass}`} aria-labelledby={`rail-${title.replace(/\s/g, '-')}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            {label && <p className="label-caps text-leaf mb-2">{label}</p>}
            <h2 id={`rail-${title.replace(/\s/g, '-')}`} className="font-heading text-3xl md:text-4xl font-bold text-forest">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Scroll arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canLeft}
                className="w-9 h-9 rounded-full border border-idle flex items-center justify-center text-ink-green hover:border-leaf hover:text-leaf disabled:opacity-30 transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18}/>
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canRight}
                className="w-9 h-9 rounded-full border border-idle flex items-center justify-center text-ink-green hover:border-leaf hover:text-leaf disabled:opacity-30 transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight size={18}/>
              </button>
            </div>
            <Link href={viewAllHref} className="flex items-center gap-1 text-sm font-semibold text-leaf hover:text-leaf-2 transition-colors">
              View all <ArrowRight size={15}/>
            </Link>
          </div>
        </div>

        {/* Scrollable rail */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {products.map(product => (
            <div key={product.id} className="shrink-0 w-[220px] sm:w-[260px] md:w-[280px]">
              <ProductCard product={product}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

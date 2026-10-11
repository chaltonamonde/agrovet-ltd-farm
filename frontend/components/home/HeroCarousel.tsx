'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const [drag,    setDrag]    = useState<{ startX: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = heroSlides.length;

  const go = useCallback((idx: number) => {
    setCurrent(((idx % total) + total) % total);
  }, [total]);

  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  // Auto-play
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next]);

  // Touch / swipe
  const onTouchStart = (e: React.TouchEvent) => setDrag({ startX: e.touches[0].clientX });
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (!drag) return;
    const delta = drag.startX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
    setDrag(null);
  };

  const slide = heroSlides[current];

  // Gradient backgrounds cycle
  const gradients = [
    'from-[#1a3319] via-[#223F21] to-[#2D4D28]',
    'from-[#1e3d1e] via-[#265626] to-[#1a3319]',
    'from-[#223F21] via-[#2D4D28] to-[#1a3319]',
    'from-[#162e15] via-[#223F21] to-[#265626]',
    'from-[#1a3319] via-[#265626] to-[#2D4D28]',
  ];

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Featured promotions carousel"
      aria-live="polite"
    >
      {/* Slides */}
      <div className={cn('relative min-h-[420px] md:min-h-[520px] lg:min-h-[580px] bg-gradient-to-br', gradients[current])}>

        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-card/[0.03] blur-3xl"/>
          <div className="absolute bottom-0 -left-10 w-64 h-64 rounded-full bg-leaf/10 blur-2xl"/>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-gold/10 blur-xl"/>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center py-12 md:py-16 relative z-10">
          <div className="flex-1 max-w-lg animate-fade-in-up" key={current}>
            {/* Gold label */}
            <span className="inline-flex items-center gap-2 bg-gold/20 text-gold border border-gold/30 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block"/> {slide.label}
            </span>

            {/* Headline */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-none mb-4">
              {slide.headline}
            </h1>

            {/* Subtext */}
            <p className="text-pale text-base md:text-lg leading-relaxed mb-8 max-w-md">
              {slide.subtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href={slide.buttonHref} className="btn-gold px-6 py-3 text-sm font-bold inline-block">
                {slide.buttonText}
              </Link>
              <Link href="/contact" className="btn-outline-white px-6 py-3 text-sm inline-block">
                Talk to Agronomist
              </Link>
            </div>
          </div>

          {/* Right decorative element */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-spin" style={{ animationDuration: '20s' }}/>
              <div className="absolute inset-6 rounded-full border border-gold/20"/>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl mb-2">
                    {['🌿','🪴','🥬','🌱','🌾'][current]}
                  </div>
                  <div className="text-white/60 text-sm font-medium">Quality Assured</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20}/>
        </button>
        <button
          onClick={next}
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          aria-label="Next slide"
        >
          <ChevronRight size={20}/>
        </button>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 py-4 bg-card">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current}
            className={cn(
              'rounded-full transition-all duration-300',
              i === current ? 'w-8 h-2.5 bg-leaf' : 'w-2.5 h-2.5 bg-idle hover:bg-leaf-2'
            )}
          />
        ))}
      </div>
    </section>
  );
}

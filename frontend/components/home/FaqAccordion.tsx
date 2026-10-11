'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqItems } from '@/data/mockData';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 5;

export default function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [page,   setPage]   = useState(0);

  const totalPages = Math.ceil(faqItems.length / ITEMS_PER_PAGE);
  const visibleFaqs = faqItems.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

  // FAQPage JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <section className="py-16 bg-card" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <p className="label-caps text-leaf mb-2">Got questions?</p>
          <h2 id="faq-heading" className="font-heading text-4xl md:text-5xl font-bold text-forest">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3" role="list">
          {visibleFaqs.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                role="listitem"
                className={cn(
                  'border rounded-2xl overflow-hidden transition-all duration-200',
                  isOpen ? 'border-leaf shadow-md' : 'border-pale hover:border-idle'
                )}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-pale transition-colors"
                  aria-expanded={isOpen}
                  id={`faq-btn-${faq.id}`}
                  aria-controls={`faq-panel-${faq.id}`}
                >
                  <span className="font-semibold text-ink-green text-sm leading-snug pr-2">{faq.question}</span>
                  <span className={cn('shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all', isOpen ? 'bg-leaf text-white' : 'bg-pale text-idle')}>
                    {isOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                  </span>
                </button>

                <div
                  id={`faq-panel-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <p className="px-5 pb-5 text-sm text-idle leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => { setPage(i); setOpenId(null); }}
              className={cn(
                'w-9 h-9 rounded-full text-sm font-semibold transition-all',
                i === page ? 'bg-leaf text-white shadow' : 'bg-pale text-ink-green hover:bg-idle'
              )}
              aria-label={`FAQ page ${i + 1}`}
              aria-current={i === page ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-idle mt-4">
          Showing {page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, faqItems.length)} of {faqItems.length} questions
        </p>
      </div>
    </section>
  );
}

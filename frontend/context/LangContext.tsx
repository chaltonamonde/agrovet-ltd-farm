'use client';
import React, { createContext, useContext, useState } from 'react';

type Lang = 'en' | 'sw';

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
  t: (en: string, sw: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  toggle: () => {},
  t: (en) => en,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('agrovet_lang') as Lang | null;
      if (stored === 'en' || stored === 'sw') return stored;
    }
    return 'en';
  });

  const toggle = () => {
    setLang(prev => {
      const next: Lang = prev === 'en' ? 'sw' : 'en';
      localStorage.setItem('agrovet_lang', next);
      return next;
    });
  };

  const t = (en: string, sw: string) => lang === 'sw' ? sw : en;

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);

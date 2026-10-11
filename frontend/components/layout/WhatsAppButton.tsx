'use client';
import { buildWhatsAppUrl } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '254700000000'; // placeholder
const MESSAGE = `Habari! I need help with farm inputs from Agrovet Ltd.`;

export default function WhatsAppButton() {
  return (
    <a
      href={buildWhatsAppUrl(WHATSAPP_NUMBER, MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-40 flex items-center gap-2 bg-whatsapp text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 group"
      style={{ padding: '12px 16px' }}
    >
      <MessageCircle size={22} fill="white" className="shrink-0"/>
      <span className="max-w-0 overflow-hidden group-hover:max-w-[160px] transition-all duration-300 text-sm font-semibold whitespace-nowrap">
        Talk to Agronomist
      </span>
    </a>
  );
}

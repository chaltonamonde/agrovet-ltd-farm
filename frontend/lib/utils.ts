import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a number as Kenyan Shillings */
export function formatKsh(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`;
}

/** Get the price range string for a product's variants */
export function getPriceRange(variants: { price: number }[]): string {
  const prices = variants.map(v => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return formatKsh(min);
  return `${formatKsh(min)} – ${formatKsh(max)}`;
}

/** Get stock label and colour class */
export function getStockInfo(stock: 'in_stock' | 'low_stock' | 'out_of_stock'): {
  label: string; colour: string; dot: string;
} {
  switch (stock) {
    case 'in_stock':     return { label: 'In stock',     colour: 'text-leaf',   dot: 'bg-leaf'   };
    case 'low_stock':    return { label: 'Low stock',    colour: 'text-gold',   dot: 'bg-gold'   };
    case 'out_of_stock': return { label: 'Out of stock', colour: 'text-red-500',dot: 'bg-red-500'};
  }
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Build a WhatsApp deep-link URL with pre-filled message */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

/** Truncate text to n characters */
export function truncate(text: string, n: number): string {
  return text.length > n ? text.slice(0, n).trimEnd() + '…' : text;
}

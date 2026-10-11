'use client';
import React from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatKsh, cn } from '@/lib/utils';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalItems, subtotal, updateQty, removeItem } = useCart();

  const FREE_DELIVERY_THRESHOLD = 5000;
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress  = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white flex flex-col shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-pale bg-forest text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20}/>
            <span className="font-heading text-xl font-bold">Your Cart</span>
            {totalItems > 0 && (
              <span className="bg-gold text-forest text-xs font-bold rounded-full px-2 py-0.5">{totalItems}</span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-card/10 transition-colors" aria-label="Close cart">
            <X size={20}/>
          </button>
        </div>

        {/* Free delivery progress */}
        {subtotal > 0 && (
          <div className="px-5 py-3 bg-pale border-b border-idle">
            {remaining > 0 ? (
              <p className="text-xs text-ink-green mb-1.5">
                Add <strong className="text-leaf">{formatKsh(remaining)}</strong> more for free delivery to Nairobi!
              </p>
            ) : (
              <p className="text-xs text-leaf font-semibold mb-1.5">🎉 You've unlocked free Nairobi delivery!</p>
            )}
            <div className="h-1.5 bg-idle rounded-full overflow-hidden">
              <div
                className="h-full bg-leaf rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag size={48} className="text-idle mb-4"/>
              <h3 className="font-heading text-2xl font-bold text-forest mb-2">Your cart is empty</h3>
              <p className="text-sm text-idle mb-6">Add farm inputs to get started.</p>
              <button onClick={onClose} className="btn-leaf px-6 py-3 text-sm font-semibold">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-3 p-3 bg-pale rounded-xl">
                  {/* Image placeholder */}
                  <div className="w-16 h-16 rounded-xl bg-pale-2 flex items-center justify-center shrink-0 text-2xl">
                    🌿
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-green text-sm leading-tight mb-0.5 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-xs text-idle mb-2">{item.packSize}</p>

                    <div className="flex items-center justify-between gap-2">
                      {/* Qty stepper */}
                      <div className="flex items-center gap-1 bg-card rounded-full border border-idle overflow-hidden">
                        <button
                          onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-pale transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13}/>
                        </button>
                        <span className="text-sm font-semibold min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-pale transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13}/>
                        </button>
                      </div>

                      <span className="font-heading font-bold text-forest text-base">
                        {formatKsh(item.price * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="p-1.5 rounded-full text-idle hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-pale bg-pale">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-ink-green">Subtotal</span>
              <span className="font-heading text-2xl font-bold text-forest">{formatKsh(subtotal)}</span>
            </div>
            <p className="text-xs text-idle mb-4">Delivery cost calculated at checkout based on your county.</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/checkout"
                onClick={onClose}
                className="btn-leaf w-full text-center py-3.5 font-bold text-sm flex items-center justify-center gap-2"
              >
                Checkout — {formatKsh(subtotal)} <ArrowRight size={16}/>
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="text-center text-sm text-ink-green hover:text-leaf transition-colors py-2"
              >
                View full cart
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

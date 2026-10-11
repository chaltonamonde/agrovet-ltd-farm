'use client';
import { useCart } from '@/context/CartContext';
import { formatKsh, cn } from '@/lib/utils';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, subtotal, totalItems, updateQty, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={56} className="text-idle mx-auto mb-5"/>
        <h1 className="font-heading text-4xl font-bold text-forest mb-3">Your cart is empty</h1>
        <p className="text-idle text-sm mb-8">You have not added any products yet. Browse our range and find what your farm needs!</p>
        <Link href="/shop" className="btn-leaf px-8 py-3 text-sm font-bold inline-block">
          Browse Farm Inputs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">Shopping Cart</h1>
        <button onClick={clearCart} className="text-xs text-idle hover:text-red-500 transition-colors">Clear all</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.productId}-${item.variantId}`} className="card p-4 flex gap-4">
              <div className="w-20 h-20 rounded-2xl bg-pale flex items-center justify-center shrink-0 text-3xl">🌿</div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.slug}`} className="font-heading font-bold text-lg text-forest hover:text-leaf transition-colors line-clamp-2 leading-tight">
                  {item.name}
                </Link>
                <p className="text-xs text-idle mt-1 mb-3">{item.packSize}</p>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1 border border-idle rounded-full overflow-hidden">
                    <button onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-pale" aria-label="Decrease">
                      <Minus size={13}/>
                    </button>
                    <span className="text-sm font-semibold min-w-[1.5rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-pale" aria-label="Increase">
                      <Plus size={13}/>
                    </button>
                  </div>
                  <span className="font-heading font-bold text-xl text-forest">{formatKsh(item.price * item.quantity)}</span>
                  <button onClick={() => removeItem(item.productId, item.variantId)} className="p-1.5 text-idle hover:text-red-500 transition-colors" aria-label="Remove">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-28">
            <h2 className="font-heading text-2xl font-bold text-forest mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-idle">Subtotal ({totalItems} items)</span>
                <span className="font-semibold">{formatKsh(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-idle">Delivery</span>
                <span className="text-leaf font-semibold">Calculated at checkout</span>
              </div>
              <div className="border-t border-pale pt-3 flex justify-between">
                <span className="font-bold text-ink-green">Estimated Total</span>
                <span className="font-heading text-2xl font-bold text-forest">{formatKsh(subtotal)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-leaf w-full text-center py-3.5 font-bold text-sm flex items-center justify-center gap-2 mb-3">
              Proceed to Checkout <ArrowRight size={16}/>
            </Link>
            <Link href="/shop" className="text-center text-sm text-leaf hover:text-leaf-2 transition-colors block">
              ← Continue Shopping
            </Link>

            {/* Delivery note */}
            <div className="mt-5 bg-pale rounded-xl p-4 text-xs text-ink-green leading-relaxed">
              🚚 <strong>Nationwide delivery.</strong> Rates vary by county and parcel weight. Free delivery on orders above KSh 5,000 to Nairobi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatKsh } from '@/lib/utils';
import { countyDelivery } from '@/data/mockData';
import { ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [selectedCounty, setSelectedCounty] = useState('Nairobi');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa_stk' | 'mpesa_till' | 'pod' | 'pickup'>('mpesa_stk');
  const [phone, setPhone] = useState('0712345678');
  const [name, setName] = useState('Samuel Mwangi');
  const [location, setLocation] = useState('Nairobi CBD / Westlands');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedCode, setConfirmedCode] = useState<string | null>(null);

  const countyInfo = countyDelivery.find(c => c.county === selectedCounty) || countyDelivery[0];
  const shippingFee = subtotal >= 10000 || paymentMethod === 'pickup' ? 0 : countyInfo.rate;
  const grandTotal = subtotal + shippingFee;

  const handlePay = () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const code = 'QJK' + Math.floor(1000000 + Math.random() * 9000000);
      setConfirmedCode(code);
      clearCart();
    }, 3000);
  };

  if (confirmedCode) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-pale rounded-full flex items-center justify-center text-leaf text-3xl mx-auto mb-4">
          ✓
        </div>
        <h1 className="font-heading text-4xl text-forest mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-4">M-Pesa Transaction Receipt: <strong className="text-forest font-mono">{confirmedCode}</strong></p>
        <div className="bg-pale-2 p-4 rounded-xl text-sm text-left mb-6 text-ink-green space-y-1">
          <div>✓ Dispatched to: {name} ({selectedCounty} - {location})</div>
          <div>✓ Delivery update SMS sent to: {phone}</div>
          <div>✓ Customer support: +254 700 000 000</div>
        </div>
        <Link href="/shop" className="btn btn-leaf inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-heading text-3xl md:text-4xl text-forest mb-2">Checkout & Farm Delivery</h1>
      <p className="text-gray-600 text-sm mb-8">Review your order and select your county for instant delivery calculation.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <div className="bg-card p-6 rounded-2xl border border-idle/40">
            <h2 className="font-heading text-xl text-forest mb-4 flex items-center gap-2">
              <Truck size={20} className="text-leaf" /> 1. Delivery Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase text-forest mb-1">Farmer Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-idle/60 rounded-xl px-4 py-2.5 text-sm"
                  placeholder="e.g. John Kamau"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-forest mb-1">Safaricom Phone *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-idle/60 rounded-xl px-4 py-2.5 text-sm"
                  placeholder="07XX XXX XXX"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-forest mb-1">Destination County *</label>
              <select
                value={selectedCounty}
                onChange={e => setSelectedCounty(e.target.value)}
                className="w-full border border-idle/60 rounded-xl px-4 py-2.5 text-sm"
              >
                {countyDelivery.map(c => (
                  <option key={c.county} value={c.county}>
                    {c.county} — {formatKsh(c.rate)} ({c.estimatedDays})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-forest mb-1">Town / Landmark *</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full border border-idle/60 rounded-xl px-4 py-2.5 text-sm"
                placeholder="e.g. Ruiru Stage / Near Post Office"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card p-6 rounded-2xl border border-idle/40">
            <h2 className="font-heading text-xl text-forest mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-leaf" /> 2. Payment Method
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'mpesa_stk' ? 'border-leaf bg-pale-2' : 'border-idle/40'
                }`}
                onClick={() => setPaymentMethod('mpesa_stk')}
              >
                <input type="radio" checked={paymentMethod === 'mpesa_stk'} readOnly className="mt-1" />
                <div>
                  <div className="font-bold text-forest">Lipa na M-Pesa STK Push (Instant Prompt)</div>
                  <div className="text-xs text-gray-500">Automated pop-up prompt sent to your phone. Enter M-Pesa PIN.</div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'pod' ? 'border-leaf bg-pale-2' : 'border-idle/40'
                }`}
                onClick={() => setPaymentMethod('pod')}
              >
                <input type="radio" checked={paymentMethod === 'pod'} readOnly className="mt-1" />
                <div>
                  <div className="font-bold text-forest">Pay on Delivery (Nairobi & Kiambu Only)</div>
                  <div className="text-xs text-gray-500">Inspect parcel with courier rider before paying via M-Pesa.</div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'pickup' ? 'border-leaf bg-pale-2' : 'border-idle/40'
                }`}
                onClick={() => setPaymentMethod('pickup')}
              >
                <input type="radio" checked={paymentMethod === 'pickup'} readOnly className="mt-1" />
                <div>
                  <div className="font-bold text-forest">Pick up at Nairobi Shop (Free)</div>
                  <div className="text-xs text-gray-500">Kirinyaga Road Agricultural Center, Shop No. 12. Mon-Sat 7am-6pm.</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card p-6 rounded-2xl border border-idle/40 sticky top-24">
            <h2 className="font-heading text-xl text-forest mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.variantId} className="flex justify-between text-sm pb-2 border-b border-idle/20">
                  <div>
                    <div className="font-medium text-forest">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.packSize} × {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-forest">
                    {formatKsh(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-idle/40 pt-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatKsh(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({selectedCounty})</span>
                <span className="font-semibold text-leaf">
                  {shippingFee === 0 ? 'FREE' : formatKsh(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg text-forest pt-2 border-t border-idle/30">
                <span>Total Amount</span>
                <span>{formatKsh(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing || items.length === 0}
              className="w-full btn btn-gold py-3 text-base font-bold mb-3 disabled:opacity-50"
            >
              {isProcessing ? 'Triggering M-Pesa STK Push...' : `Pay ${formatKsh(grandTotal)} via M-Pesa`}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 text-center">
              <ShieldCheck size={14} className="text-leaf" />
              <span>Safaricom Daraja API Verified • PCPB Licensed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

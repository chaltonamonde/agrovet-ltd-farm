'use client';
import { notFound } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, MessageCircle, ChevronDown, ChevronUp, Shield, Minus, Plus } from 'lucide-react';
import { sampleProducts } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { formatKsh, getStockInfo, buildWhatsAppUrl, cn } from '@/lib/utils';
import ProductGrid from '@/components/shop/ProductGrid';
import { use } from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}

const tabs = ['Description', 'How to Use', 'Safety & PPE', 'Dosage & Label'] as const;
type Tab = typeof tabs[number];

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const product = sampleProducts.find(p => p.slug === slug);
  if (!product) notFound();

  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0].id);
  const [quantity,          setQuantity]           = useState(1);
  const [activeTab,         setActiveTab]          = useState<Tab>('Description');
  const [added,             setAdded]              = useState(false);

  const variant = product.variants.find(v => v.id === selectedVariantId) ?? product.variants[0];
  const { label: stockLabel, colour: stockColour } = getStockInfo(variant.stock);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addItem(product, variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappMsg = `Hi! I'd like to order:\n*${product.name}* — ${variant.packSize}\nQty: ${quantity}\nPrice: ${formatKsh(variant.price * quantity)}\n\nPlease confirm availability and delivery.`;

  const relatedProducts = sampleProducts
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const tabContent: Record<Tab, string | undefined> = {
    'Description':   product.description || product.shortDescription,
    'How to Use':    product.howToUse,
    'Safety & PPE':  product.safety,
    'Dosage & Label': product.dosageInfo
      ? `Dosage: ${product.dosageInfo}\n\nPre-Harvest Interval: ${product.preHarvestInterval || 'See label.'}\n\nAlways read the full product label before use. Follow PCPB guidelines.`
      : undefined,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-idle">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-leaf">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/shop" className="hover:text-leaf">Shop</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/category/${product.categorySlug}`} className="hover:text-leaf">{product.categoryName}</Link></li>
          {product.subCategorySlug && (
            <>
              <li aria-hidden>/</li>
              <li><Link href={`/category/${product.subCategorySlug}`} className="hover:text-leaf">{product.subCategoryName}</Link></li>
            </>
          )}
          <li aria-hidden>/</li>
          <li className="text-ink-green font-medium line-clamp-1">{product.name}</li>
        </ol>
      </nav>

      {/* Main product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
        {/* Image gallery (placeholder) */}
        <div>
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-pale to-pale-2 flex items-center justify-center mb-4 border border-idle overflow-hidden">
            <span className="text-8xl opacity-40">
              {product.categorySlug === 'crop-production' ? '🌿' :
               product.categorySlug === 'seeds-fertilizers' ? '🌱' :
               product.categorySlug === 'farm-tools' ? '🔧' : '🪴'}
            </span>
          </div>
          {/* Thumbnail strip */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[1,2,3].map(i => (
              <div key={i} className="shrink-0 w-16 h-16 rounded-xl bg-pale border-2 border-idle hover:border-leaf cursor-pointer transition-colors flex items-center justify-center text-2xl opacity-50">
                🌿
              </div>
            ))}
          </div>
          {/* PCPB notice */}
          {product.pcpbRegistration && (
            <div className="mt-4 flex items-center gap-2 bg-pale rounded-xl px-4 py-3 text-xs text-ink-green">
              <Shield size={16} className="text-leaf shrink-0"/>
              PCPB Reg. No.: <strong>{product.pcpbRegistration}</strong> — Genuine, registered agrochemical.
            </div>
          )}
        </div>

        {/* Product details */}
        <div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.isNew && <span className="bg-gold text-forest text-xs font-bold px-3 py-1 rounded-full">New</span>}
            {product.subCategoryName && (
              <span className="bg-pale text-leaf text-xs font-bold px-3 py-1 rounded-full border border-pale-2">
                {product.subCategoryName}
              </span>
            )}
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest mb-2 leading-tight">
            {product.name}
          </h1>

          {product.activeIngredient && (
            <p className="text-sm text-idle mb-3">Active ingredient: <strong className="text-ink-green">{product.activeIngredient}</strong></p>
          )}

          <p className="text-sm text-ink-green leading-relaxed mb-5">{product.shortDescription}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-5">
            <span className={cn('w-2 h-2 rounded-full', getStockInfo(variant.stock).dot)}/>
            <span className={cn('text-sm font-semibold', stockColour)}>{stockLabel}</span>
          </div>

          {/* Pack size selector */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-ink-green mb-3">Select pack size:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    disabled={v.stock === 'out_of_stock'}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all',
                      v.id === selectedVariantId
                        ? 'border-leaf bg-leaf text-white shadow-md'
                        : v.stock === 'out_of_stock'
                        ? 'border-idle text-idle cursor-not-allowed opacity-50'
                        : 'border-idle text-ink-green hover:border-leaf hover:text-leaf'
                    )}
                    aria-pressed={v.id === selectedVariantId}
                  >
                    {v.packSize}
                    {v.stock === 'out_of_stock' && ' (sold out)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-heading text-4xl font-bold text-forest">{formatKsh(variant.price)}</span>
            {variant.oldPrice && (
              <span className="text-lg text-idle line-through">{formatKsh(variant.oldPrice)}</span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-5">
            <p className="text-sm font-semibold text-ink-green">Qty:</p>
            <div className="flex items-center gap-2 border-2 border-idle rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-pale transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={16}/>
              </button>
              <span className="font-semibold text-ink-green min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-pale transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={16}/>
              </button>
            </div>
            <span className="text-sm text-idle">
              Total: <strong className="text-forest">{formatKsh(variant.price * quantity)}</strong>
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAdd}
              disabled={variant.stock === 'out_of_stock'}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3.5 font-bold text-sm rounded-full transition-all',
                added
                  ? 'bg-forest text-white'
                  : variant.stock === 'out_of_stock'
                  ? 'bg-idle text-white cursor-not-allowed'
                  : 'btn-leaf'
              )}
            >
              <ShoppingCart size={18}/>
              {added ? '✓ Added to Cart!' : `Add to Cart — ${formatKsh(variant.price * quantity)}`}
            </button>
            <a
              href={buildWhatsAppUrl('254700000000', whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-whatsapp text-white rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={18}/> Order on WhatsApp
            </a>
          </div>

          {/* Target crops */}
          {product.targetCrops && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-idle uppercase tracking-wide mb-2">Suitable for crops:</p>
              <div className="flex flex-wrap gap-1.5">
                {product.targetCrops.map(crop => (
                  <span key={crop} className="bg-pale text-ink-green text-xs px-3 py-1 rounded-full border border-pale-2">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Target pests */}
          {product.targetPests && (
            <div>
              <p className="text-xs font-semibold text-idle uppercase tracking-wide mb-2">Controls:</p>
              <div className="flex flex-wrap gap-1.5">
                {product.targetPests.map(pest => (
                  <span key={pest} className="bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full border border-red-100">
                    {pest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Information tabs */}
      <div className="mb-14">
        {/* Tab buttons */}
        <div className="flex gap-0 border-b border-pale overflow-x-auto no-scrollbar mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all',
                activeTab === tab
                  ? 'border-leaf text-leaf'
                  : 'border-transparent text-idle hover:text-ink-green'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-pale rounded-2xl p-6 text-sm text-ink-green leading-relaxed whitespace-pre-line">
          {tabContent[activeTab] || (
            <p className="text-idle italic">
              Information for this section will be provided by the owner. Contact us on WhatsApp for immediate guidance.
            </p>
          )}
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-heading text-3xl font-bold text-forest mb-6">
            Related Products
          </h2>
          <ProductGrid products={relatedProducts}/>
        </section>
      )}
    </div>
  );
}

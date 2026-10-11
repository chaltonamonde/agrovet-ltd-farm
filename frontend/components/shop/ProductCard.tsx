'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Eye, MessageCircle, Zap } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatKsh, getPriceRange, getStockInfo, buildWhatsAppUrl, cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [wishlist,  setWishlist]  = useState(false);
  const [added,     setAdded]     = useState(false);

  const defaultVariant = product.variants[0];
  const hasMultiVariant = product.variants.length > 1;
  const priceRange = getPriceRange(product.variants);
  const { label: stockLabel, colour: stockColour, dot: stockDot } = getStockInfo(defaultVariant.stock);
  const isOnSale = defaultVariant.oldPrice !== undefined && defaultVariant.oldPrice > defaultVariant.price;

  const whatsappMsg = `Hi! I'd like to order: ${product.name} (${defaultVariant.packSize}) from Agrovet Ltd.`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, defaultVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist(v => !v);
  };

  return (
    <article className="card group flex flex-col overflow-hidden relative">
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-pale rounded-t-[1.25rem]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pale to-pale-2">
            <span className="text-5xl opacity-60">
              {product.categorySlug === 'crop-production' ? '🌿' :
               product.categorySlug === 'seeds-fertilizers' ? '🌱' :
               product.categorySlug === 'farm-tools'        ? '🔧' : '🪴'}
            </span>
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOnSale && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Sale
            </span>
          )}
          {product.isNew && (
            <span className="bg-gold text-forest text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
            wishlist
              ? 'bg-red-50 text-red-500 scale-110'
              : 'bg-white/80 text-idle hover:text-red-400 hover:bg-white'
          )}
          aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlist}
        >
          <Heart size={15} fill={wishlist ? 'currentColor' : 'none'}/>
        </button>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-forest/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            href={`/product/${product.slug}`}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-gold transition-colors"
            aria-label={`Quick view ${product.name}`}
            onClick={e => e.stopPropagation()}
          >
            <Eye size={17} className="text-forest"/>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <span className="label-caps text-leaf mb-1">{product.subCategoryName || product.categoryName}</span>

        {/* Name */}
        <Link href={`/product/${product.slug}`} className="group/name">
          <h3 className="font-heading font-bold text-lg text-forest group-hover/name:text-leaf transition-colors leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Stock status */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className={cn('w-1.5 h-1.5 rounded-full', stockDot)}/>
          <span className={cn('text-xs font-medium', stockColour)}>{stockLabel}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="font-heading font-bold text-xl text-forest">{priceRange}</span>
          {isOnSale && defaultVariant.oldPrice && (
            <span className="text-sm text-idle line-through">{formatKsh(defaultVariant.oldPrice)}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {hasMultiVariant ? (
            <Link
              href={`/product/${product.slug}`}
              className="flex-1 btn-leaf text-center py-2.5 text-sm font-semibold rounded-full"
            >
              View Product
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={defaultVariant.stock === 'out_of_stock'}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-full transition-all duration-200',
                added
                  ? 'bg-forest-2 text-white'
                  : defaultVariant.stock === 'out_of_stock'
                  ? 'bg-idle text-white cursor-not-allowed'
                  : 'btn-leaf'
              )}
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? (
                <><Zap size={15}/> Added!</>
              ) : (
                <><ShoppingCart size={15}/> Add to Cart</>
              )}
            </button>
          )}

          {/* WhatsApp order */}
          <a
            href={buildWhatsAppUrl('254700000000', whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-pale border border-idle hover:bg-whatsapp hover:border-whatsapp hover:text-white transition-all"
            aria-label="Order via WhatsApp"
          >
            <MessageCircle size={17} className="text-ink-green group-hover:text-white"/>
          </a>
        </div>
      </div>
    </article>
  );
}

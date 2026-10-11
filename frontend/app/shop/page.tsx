import type { Metadata } from 'next';
import { sampleProducts, categories } from '@/data/mockData';
import ProductGrid from '@/components/shop/ProductGrid';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shop Farm Inputs',
  description: 'Browse all farm inputs — herbicides, insecticides, fungicides, seeds, fertilizers and farm tools available nationwide in Kenya.',
};

export default function ShopPage() {
  const chipCategories = [
    { label: 'All',          slug: '' },
    { label: 'Herbicides',   slug: 'herbicides' },
    { label: 'Insecticides', slug: 'insecticides' },
    { label: 'Fungicides',   slug: 'fungicides' },
    { label: 'Seeds',        slug: 'seeds' },
    { label: 'Fertilizers',  slug: 'granular-fertilizers' },
    { label: 'Farm Tools',   slug: 'farm-tools' },
    { label: 'Planting Media', slug: 'planting-media' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-idle">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-leaf transition-colors">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-ink-green font-medium">Shop</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">Shop Farm Inputs</h1>
          <p className="text-sm text-idle mt-1">{sampleProducts.length} products available</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-idle rounded-full px-4 py-2.5 text-sm text-ink-green hover:border-leaf hover:text-leaf transition-colors">
            <SlidersHorizontal size={16}/> Filters
          </button>
          <select className="border border-idle rounded-full px-4 py-2.5 text-sm text-ink-green bg-card outline-none focus:border-leaf cursor-pointer" aria-label="Sort products">
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
        {chipCategories.map(cat => (
          <Link
            key={cat.slug}
            href={cat.slug ? `/category/${cat.slug}` : '/shop'}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-medium border border-idle bg-card text-ink-green hover:border-leaf hover:text-leaf hover:bg-pale transition-all"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Category sections */}
      <div className="space-y-14">
        {categories.map(cat => {
          const catProducts = sampleProducts.filter(p => p.categorySlug === cat.slug);
          if (!catProducts.length) return null;
          return (
            <section key={cat.slug} aria-labelledby={`cat-${cat.slug}`}>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <span className="text-2xl mr-2">{cat.icon}</span>
                  <h2 id={`cat-${cat.slug}`} className="font-heading text-2xl md:text-3xl font-bold text-forest inline">
                    {cat.name}
                  </h2>
                </div>
                <Link href={`/category/${cat.slug}`} className="text-sm font-semibold text-leaf hover:text-leaf-2 transition-colors">
                  View All →
                </Link>
              </div>
              <ProductGrid products={catProducts}/>
            </section>
          );
        })}
      </div>
    </div>
  );
}

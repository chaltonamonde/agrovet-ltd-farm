import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { sampleProducts, categories } from '@/data/mockData';
import ProductGrid from '@/components/shop/ProductGrid';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

function findCategory(slug: string) {
  for (const cat of categories) {
    if (cat.slug === slug) return { cat, parent: null };
    for (const sub of cat.children ?? []) {
      if (sub.slug === slug) return { cat: sub, parent: cat };
    }
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = findCategory(slug);
  if (!found) return { title: 'Category Not Found' };
  const { cat } = found;
  return {
    title: `${cat.name} — Agrovet Ltd`,
    description: `Shop ${cat.name} from Agrovet Ltd. ${cat.description}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const found = findCategory(slug);
  if (!found) notFound();

  const { cat, parent } = found;

  // Products matching this category or sub-category
  const products = sampleProducts.filter(
    p => p.categorySlug === slug || p.subCategorySlug === slug
  );

  // Sub-categories to show as chips (for top-level cats)
  const subs = cat.children ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-idle">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-leaf transition-colors">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/shop" className="hover:text-leaf transition-colors">Shop</Link></li>
          {parent && (
            <>
              <li aria-hidden>/</li>
              <li><Link href={`/category/${parent.slug}`} className="hover:text-leaf transition-colors">{parent.name}</Link></li>
            </>
          )}
          <li aria-hidden>/</li>
          <li className="text-ink-green font-medium">{cat.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {(cat as { icon?: string }).icon && <span className="text-3xl">{(cat as { icon?: string }).icon}</span>}
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">{cat.name}</h1>
        </div>
        <p className="text-idle text-sm max-w-2xl">{cat.description}</p>
      </div>

      {/* Sub-category chips */}
      {subs.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {subs.map(sub => (
            <Link
              key={sub.slug}
              href={`/category/${sub.slug}`}
              className="px-4 py-2 rounded-full text-sm font-medium border border-idle bg-card text-ink-green hover:border-leaf hover:text-leaf hover:bg-pale transition-all"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Products */}
      {products.length > 0 ? (
        <ProductGrid products={products}/>
      ) : (
        <div className="text-center py-20 bg-pale rounded-2xl">
          <p className="text-4xl mb-4">🌿</p>
          <h2 className="font-heading text-2xl font-bold text-forest mb-2">Products coming soon!</h2>
          <p className="text-sm text-idle mb-6">We&apos;re adding products to this category. Check back soon.</p>
          <Link href="/shop" className="btn-leaf px-6 py-3 text-sm font-semibold inline-block">Browse All Products</Link>
        </div>
      )}
    </div>
  );
}

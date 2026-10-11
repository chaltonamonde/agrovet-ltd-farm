import ProductCard from '@/components/shop/ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

const colClasses: Record<number, string> = {
  2: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
};

export default function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="text-center py-16 text-idle">
        <p className="text-4xl mb-3">🌿</p>
        <p className="font-semibold text-lg">No products found</p>
        <p className="text-sm mt-1">Check back soon — we&apos;re adding new products regularly.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClasses[columns]} gap-4 md:gap-5`}>
      {products.map((product, i) => (
        <div key={product.id} className="reveal" style={{ animationDelay: `${i * 0.05}s` }}>
          <ProductCard product={product} priority={i < 4}/>
        </div>
      ))}
    </div>
  );
}

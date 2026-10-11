import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categoryRailItems } from '@/data/mockData';

export default function CategoryRail() {
  return (
    <section className="py-14 bg-pale-2" aria-labelledby="category-heading">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="label-caps text-leaf mb-2">Shop by type</p>
            <h2 id="category-heading" className="font-heading text-4xl md:text-5xl font-bold text-forest leading-none">
              Shop Farm Inputs<br className="hidden sm:block"/> by Category
            </h2>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-leaf hover:text-leaf-2 transition-colors">
            View all <ArrowRight size={16}/>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoryRailItems.map((item, i) => (
            <Link
              key={item.num}
              href={item.href}
              className="card group flex items-start gap-4 p-5 hover:border-leaf transition-all duration-300"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Number badge */}
              <span className="font-heading text-3xl font-bold text-pale leading-none shrink-0 group-hover:text-leaf transition-colors">
                {item.num}
              </span>

              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-xl text-forest group-hover:text-leaf transition-colors leading-tight mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-idle leading-relaxed mb-3 line-clamp-2">{item.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-leaf group-hover:gap-2.5 transition-all">
                  Shop {item.name.split(' ')[0]} <ArrowRight size={13}/>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:hidden">
          <Link href="/shop" className="btn-leaf px-6 py-3 text-sm font-semibold inline-block">
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}

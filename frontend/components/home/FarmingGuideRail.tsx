import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/mockData';

export default function FarmingGuideRail() {
  return (
    <section className="py-14 bg-pale" aria-labelledby="farming-info-heading">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="label-caps text-leaf mb-2">Learn & grow</p>
            <h2 id="farming-info-heading" className="font-heading text-3xl md:text-4xl font-bold text-forest">
              Farming Information
            </h2>
          </div>
          <Link href="/blog" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-leaf hover:text-leaf-2 transition-colors">
            View all articles <ArrowRight size={15}/>
          </Link>
        </div>

        {/* Scrollable card rail */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {blogPosts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card group shrink-0 w-[280px] sm:w-[320px] flex flex-col overflow-hidden hover:border-leaf"
            >
              {/* Image placeholder */}
              <div className="h-40 bg-gradient-to-br from-pale to-pale-2 flex items-center justify-center rounded-t-[1.25rem]">
                <span className="text-5xl opacity-50">
                  {post.category === 'Pest Control' ? '🐛' :
                   post.category === 'Soil & Nutrition' ? '🧪' :
                   post.category === 'Planting Media' ? '🪴' :
                   post.category === 'Farm Tools'     ? '🔧' : '🌿'}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <span className="label-caps text-leaf mb-2">{post.category}</span>
                <h3 className="font-heading font-bold text-forest text-lg leading-snug mb-2 group-hover:text-leaf transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-idle leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-idle">
                    <Clock size={12}/> {post.readTime} min read
                  </span>
                  {post.relatedCategorySlug && (
                    <span className="text-xs font-semibold text-leaf flex items-center gap-1">
                      Shop Products <ArrowRight size={11}/>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-6 sm:hidden">
          <Link href="/blog" className="btn-leaf px-6 py-3 text-sm font-semibold inline-block">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/data/mockData';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog & Farming Guides',
  description: 'Practical farming guides, pest control tips, fertilizer guides and agronomist advice from Agrovet Ltd Kenya.',
};

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <p className="label-caps text-leaf mb-2">Farming knowledge</p>
        <h1 className="font-heading text-5xl font-bold text-forest">Blog & Farming Guides</h1>
        <p className="text-idle text-sm mt-3 max-w-xl mx-auto">
          Practical, agronomist-verified guides to help you grow better crops, manage pests and get the most from your inputs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="card group flex flex-col overflow-hidden hover:border-leaf">
            <div className="h-44 bg-gradient-to-br from-pale to-pale-2 flex items-center justify-center rounded-t-[1.25rem]">
              <span className="text-5xl opacity-50">
                {post.category === 'Pest Control' ? '🐛' :
                 post.category === 'Soil & Nutrition' ? '🧪' :
                 post.category === 'Planting Media' ? '🪴' :
                 post.category === 'Farm Tools' ? '🔧' : '🌿'}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <span className="label-caps text-leaf mb-2">{post.category}</span>
              <h2 className="font-heading font-bold text-xl text-forest group-hover:text-leaf transition-colors leading-snug mb-2">{post.title}</h2>
              <p className="text-xs text-idle leading-relaxed mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-idle">
                <span className="flex items-center gap-1"><Clock size={12}/> {post.readTime} min read</span>
                <span className="flex items-center gap-1 text-leaf font-semibold">Read more <ArrowRight size={11}/></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

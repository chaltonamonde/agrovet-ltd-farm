import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { blogPosts } from '@/data/mockData';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return { title: 'Article Not Found' };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-leaf hover:text-leaf-2 mb-8 transition-colors">
        <ArrowLeft size={16}/> Back to Blog
      </Link>

      <span className="label-caps text-leaf mb-3 block">{post.category}</span>
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest mb-4 leading-tight">{post.title}</h1>

      <div className="flex items-center gap-4 text-xs text-idle mb-8">
        <span className="flex items-center gap-1"><Clock size={12}/> {post.readTime} min read</span>
        <span>{new Date(post.publishedAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* Hero image placeholder */}
      <div className="h-56 sm:h-72 bg-gradient-to-br from-pale to-pale-2 rounded-3xl flex items-center justify-center mb-10 text-7xl opacity-40">
        🌿
      </div>

      {/* Content placeholder */}
      <div className="prose prose-sm max-w-none text-ink-green leading-relaxed">
        <p className="text-base font-medium text-forest mb-4">{post.excerpt}</p>
        <p className="bg-pale border-l-4 border-leaf rounded-r-xl p-4 text-sm text-ink-green italic mb-6">
          📝 <strong>Note:</strong> Full article content will be provided by the owner. This is a placeholder structure 
          showing the article layout. The real article will include step-by-step advice, product recommendations and field photos.
        </p>
        <h2 className="font-heading text-2xl font-bold text-forest mb-3">Key Points</h2>
        <ul className="space-y-2 mb-6">
          <li>Practical, farmer-tested advice specific to Kenyan conditions</li>
          <li>Product recommendations linked to our shop</li>
          <li>Dosage rates, timing and application tips</li>
          <li>Safety precautions and PPE requirements</li>
        </ul>
      </div>

      {/* Shop CTA */}
      {post.relatedCategorySlug && (
        <div className="hero-gradient rounded-2xl p-6 text-white text-center my-10">
          <p className="text-pale text-sm mb-2">Related products</p>
          <h3 className="font-heading text-2xl font-bold text-white mb-4">Shop Recommended Products</h3>
          <Link href={`/category/${post.relatedCategorySlug}`} className="btn-gold px-6 py-2.5 text-sm font-bold inline-flex items-center gap-2">
            Browse Products <ArrowRight size={15}/>
          </Link>
        </div>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <section>
          <h2 className="font-heading text-3xl font-bold text-forest mb-6">More Farming Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="card p-4 group hover:border-leaf">
                <span className="label-caps text-leaf mb-1 block">{r.category}</span>
                <h3 className="font-heading font-bold text-forest group-hover:text-leaf transition-colors text-base leading-snug">{r.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import { MessageCircle, Star } from 'lucide-react';
import Link from 'next/link';

export default function TestimonialSection() {
  return (
    <section className="py-14 bg-pale-2" aria-labelledby="reviews-heading">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <p className="label-caps text-leaf mb-2">What farmers say</p>
          <h2 id="reviews-heading" className="font-heading text-4xl font-bold text-forest">
            Customer Reviews
          </h2>
        </div>

        {/* Honest state — no fake reviews */}
        <div className="max-w-lg mx-auto">
          <div className="card p-8 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={24} className="text-idle" />
              ))}
            </div>
            <h3 className="font-heading text-2xl font-bold text-forest mb-3">
              Be the First to Review!
            </h3>
            <p className="text-sm text-idle leading-relaxed mb-6">
              We only show real, verified-purchase reviews. No fake five-star walls here — 
              just honest farmer experiences. Order today and share your story!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/shop" className="btn-leaf px-6 py-3 text-sm font-semibold inline-block">
                Shop Now
              </Link>
              <a
                href="https://g.page/r/[GOOGLE-REVIEW-LINK]/review"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-white bg-forest text-white px-6 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 rounded-full"
              >
                <Star size={15}/> Leave a Google Review
              </a>
            </div>
          </div>
          <p className="text-center text-xs text-idle mt-4">
            Reviews will appear here once verified. 
            <Link href="/contact" className="text-leaf ml-1 hover:underline">Contact us</Link> if you have feedback.
          </p>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import HeroCarousel       from '@/components/home/HeroCarousel';
import TrustStrip         from '@/components/home/TrustStrip';
import CategoryRail       from '@/components/home/CategoryRail';
import ProductRail        from '@/components/home/ProductRail';
import PromoBanner        from '@/components/home/PromoBanner';
import TestimonialSection from '@/components/home/TestimonialSection';
import FarmingGuideRail   from '@/components/home/FarmingGuideRail';
import FaqAccordion       from '@/components/home/FaqAccordion';
import { sampleProducts } from '@/data/mockData';
import ProductGrid        from '@/components/shop/ProductGrid';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agrovet Ltd — Quality Farm Inputs Delivered Across Kenya',
  description:
    'Shop certified herbicides, insecticides, fungicides, seeds, fertilizers and farm tools online. Agrovet Ltd — your trusted Nairobi-based farm inputs partner with nationwide delivery.',
};

// LocalBusiness JSON-LD schema
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Agrovet Ltd',
  url: 'https://agrovet.ltd',
  logo: 'https://agrovet.ltd/icons/logo.svg',
  image: 'https://agrovet.ltd/images/store.jpg',
  description: 'Certified farm inputs supplier in Nairobi, Kenya. Herbicides, insecticides, fungicides, seeds, fertilizers and farm tools.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '[ADDRESS]',
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    addressCountry: 'KE',
  },
  telephone: '[PHONE]',
  email: '[EMAIL]',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '07:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '09:00', closes: '13:00' },
  ],
  geo: { '@type': 'GeoCoordinates', latitude: -1.286389, longitude: 36.817223 },
  priceRange: 'KSh',
};

// Filter helpers
const featuredProducts     = sampleProducts.filter(p => p.isFeatured);
const cropProtectionProds  = sampleProducts.filter(p => p.categorySlug === 'crop-production');
const seedFertProds        = sampleProducts.filter(p => p.categorySlug === 'seeds-fertilizers');
const toolsProds           = sampleProducts.filter(p => p.categorySlug === 'farm-tools');

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* 1. Hero Carousel */}
      <HeroCarousel/>

      {/* 2. Trust Strip */}
      <TrustStrip/>

      {/* 3. Shop by Category */}
      <CategoryRail/>

      {/* 4. Popular Farm Products carousel */}
      <ProductRail
        title="Popular Farm Products"
        label="Bestsellers"
        products={featuredProducts}
        viewAllHref="/shop"
        bgClass = "bg-card"
      />

      {/* 5. Shop Crop Production — grid */}
      <section className="py-14 bg-pale-2" aria-labelledby="crop-grid-heading">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="label-caps text-leaf mb-2">Protect your crops</p>
              <h2 id="crop-grid-heading" className="font-heading text-3xl md:text-4xl font-bold text-forest">
                Shop Crop Production Products
              </h2>
            </div>
            <Link href="/category/crop-production" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-leaf hover:text-leaf-2 transition-colors">
              View More <ArrowRight size={15}/>
            </Link>
          </div>
          <ProductGrid products={cropProtectionProds}/>
        </div>
      </section>

      {/* 6. Farm Tools & Equipment */}
      <section className="py-14 bg-card" aria-labelledby="tools-grid-heading">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="label-caps text-leaf mb-2">Equip your farm</p>
              <h2 id="tools-grid-heading" className="font-heading text-3xl md:text-4xl font-bold text-forest">
                Farm Tools & Equipment
              </h2>
            </div>
            <Link href="/category/farm-tools" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-leaf hover:text-leaf-2 transition-colors">
              View All <ArrowRight size={15}/>
            </Link>
          </div>
          <ProductGrid products={[...toolsProds, ...sampleProducts.filter(p => p.categorySlug === 'planting-media')]}/>
        </div>
      </section>

      {/* 7. Seeds & Fertilizers */}
      <section className="py-14 bg-pale" aria-labelledby="seeds-grid-heading">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="label-caps text-leaf mb-2">Feed and sow</p>
              <h2 id="seeds-grid-heading" className="font-heading text-3xl md:text-4xl font-bold text-forest">
                Seeds & Fertilizers for Better Yields
              </h2>
            </div>
            <Link href="/category/seeds-fertilizers" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-leaf hover:text-leaf-2 transition-colors">
              View All <ArrowRight size={15}/>
            </Link>
          </div>
          <ProductGrid products={seedFertProds}/>
        </div>
      </section>

      {/* 8. Promo Banner */}
      <PromoBanner/>

      {/* 9. Testimonials */}
      <TestimonialSection/>

      {/* 10. Farming Information */}
      <FarmingGuideRail/>

      {/* 11. Call to action + FAQ */}
      <section className="py-12 bg-forest" aria-label="Call to action">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
            Ready to grow? Let&apos;s get you sorted.
          </h2>
          <p className="text-pale text-sm mb-6 max-w-lg mx-auto">
            Browse our full catalogue or chat with our agronomist on WhatsApp — we respond within minutes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/shop" className="btn-gold px-8 py-3 font-bold text-sm inline-block">Shop All Products</Link>
            <Link href="/contact" className="btn-outline-white px-8 py-3 text-sm inline-block">Contact Us</Link>
          </div>
        </div>
      </section>

      <FaqAccordion/>

      {/* 12. Final CTA */}
      <section className="py-12 bg-pale" aria-label="Final call to action">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-forest mb-3">
            Need help choosing the right product?
          </h2>
          <p className="text-idle text-sm mb-6 max-w-lg mx-auto">
            Our in-house agronomist is here to help. Describe your crop problem and we&apos;ll recommend the right solution.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/254700000000?text=Hi!%20I%20need%20agronomist%20advice%20from%20Agrovet%20Ltd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp text-white rounded-full px-8 py-3 text-sm font-bold hover:opacity-90 transition-opacity"
            >
              💬 Chat on WhatsApp
            </a>
            <a href="tel:[PHONE]" className="btn-leaf px-8 py-3 text-sm font-semibold inline-block">
              📞 Call Us: [PHONE]
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { LangProvider } from '@/context/LangContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

export const metadata: Metadata = {
  title: {
    default: 'Agrovet Ltd — Quality Farm Inputs in Kenya',
    template: '%s | Agrovet Ltd',
  },
  description: 'Agrovet Ltd, Nairobi: Your trusted source for certified herbicides, insecticides, fungicides, seeds, fertilizers and farm tools. Nationwide delivery across Kenya.',
  keywords: ['agrovet', 'farm inputs Kenya', 'herbicides Kenya', 'seeds Kenya', 'fertilizers Kenya', 'agrochemicals Nairobi'],
  openGraph: {
    type:        'website',
    locale:      'en_KE',
    url:         'https://agrovet.ltd',
    siteName:    'Agrovet Ltd',
    title:       'Agrovet Ltd — Quality Farm Inputs in Kenya',
    description: 'Certified herbicides, insecticides, seeds, fertilizers and farm tools — delivered nationwide.',
  },
  twitter: { card: 'summary_large_image' },
  robots:  { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <LangProvider>
          <CartProvider>
            {/* Skip to content for accessibility */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 bg-leaf text-white px-4 py-2 rounded-lg font-semibold">
              Skip to main content
            </a>

            <Header/>

            <main id="main-content" className="min-h-screen pb-tab md:pb-0">
              {children}
            </main>

            <Footer/>
            <MobileTabBar/>
            <WhatsAppButton/>
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}

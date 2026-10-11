// ─── Core domain types ──────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  packSize: string;       // e.g. "100ml", "1L", "5L", "20L"
  price: number;          // KSh
  oldPrice?: number;      // KSh – shows strike-through if set
  sku: string;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockQty?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  subCategorySlug?: string;
  subCategoryName?: string;
  image: string;
  images?: string[];
  shortDescription: string;
  description?: string;
  howToUse?: string;
  safety?: string;
  dosageInfo?: string;
  preHarvestInterval?: string;
  activeIngredient?: string;
  targetPests?: string[];
  targetCrops?: string[];
  brand?: string;
  variants: ProductVariant[];
  tags?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  pcpbRegistration?: string;
  labelPdfUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  parentSlug?: string;
  children?: Category[];
  productCount?: number;
  icon?: string;
  colour?: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  packSize: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: number;
  publishedAt: string;
  relatedCategorySlug?: string;
  content?: string;
}

export interface CountyDelivery {
  county: string;
  towns: string[];
  rate: number;            // KSh – placeholder
  estimatedDays: string;   // e.g. "1-2 working days"
}

export interface HeroSlide {
  id: string;
  label: string;
  headline: string;
  subtext: string;
  buttonText: string;
  buttonHref: string;
  image: string;
  bgGradient?: string;
}

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
  verified: boolean;
}

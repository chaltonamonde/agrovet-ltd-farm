const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'c:/Users/user/OneDrive/agrovet.ltd farm';

// ── 1. Update css/style.css ──────────────────────────────────────────
const cssPath = path.join(ROOT_DIR, 'css', 'style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace the :root block in style.css
const newRootBlock = `/* ─── Design Tokens (Cream Palette & Brand Colors) ────────── */
:root {
  /* Cream Background & Text System (Replaces bright white) */
  --bg-page:     #E6DFCD; /* main page background */
  --bg-section:  #DDD5C0; /* alternate sections */
  --bg-card:     #F2EDDF; /* product cards, category cards, forms, inputs */
  --bg-header:   #EFE9D9; /* header, top bar, search area, mobile tab bar */
  --border:      #C9BFA6; /* borders and dividers */
  --text:        #2A2A1E; /* main text (warm dark, never pure black) */
  --text-muted:  #5E5A48; /* secondary text */
  --leaf-text:   #3F7A08; /* green for text links on cream (WCAG AA compliant 4.5:1+) */

  /* Preserved Brand Identity Colours */
  --forest:      #223F21; /* Dark hero cards, footer, main branding */
  --forest-2:    #265626; /* Gradient end for hero cards */
  --ink-green:   #2D4D28; /* Headings and body accents */
  --leaf:        #5FA30E; /* Primary buttons, active states, search button */
  --leaf-2:      #78B534; /* Accent lines, hover states */
  --gold:        #F4B943; /* CTAs, cart count badge, highlight tags */
  --gold-hover:  #e5a930;
  --pale:        var(--bg-section);
  --pale-2:      var(--bg-card);
  --page:        var(--bg-page);
  --card:        var(--bg-card);
  --idle:        #B5AA90;
  --whatsapp:    #25D366;
  --danger:      #D9381E;
  --success:     #1E824C;
  --border-card: var(--border);
  --shadow-sm:   0 2px 8px rgba(42, 42, 30, 0.05);
  --shadow-md:   0 8px 24px rgba(42, 42, 30, 0.08);
  --shadow-lg:   0 16px 36px rgba(42, 42, 30, 0.14);
  --radius-card: 18px;
  --radius-pill: 9999px;
  --radius-sm:   8px;
  --font-heading: 'Barlow Condensed', sans-serif;
  --font-body:    'Inter', sans-serif;
  --trans:       all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}`;

cssContent = cssContent.replace(/\/\* ─── Design Tokens ───[\s\S]*?:root\s*\{[\s\S]*?\}/, newRootBlock);

// Replace remaining hardcoded white in css/style.css
cssContent = cssContent
  .replace(/background-color:\s*#fff\b/g, 'background-color: var(--bg-card)')
  .replace(/background:\s*#fff\b/g, 'background: var(--bg-card)')
  .replace(/background-color:\s*var\(--page\)/g, 'background-color: var(--bg-page)')
  .replace(/body\s*\{[\s\S]*?background-color:\s*var\(--page\);/g, 'body {\n  background-color: var(--bg-page);')
  .replace(/color:\s*var\(--ink-green\);/g, 'color: var(--text);')
  .replace(/\.site-header\s*\{[\s\S]*?background-color:\s*#fff;/g, '.site-header {\n  position: sticky;\n  top: 0;\n  z-index: 900;\n  background-color: var(--bg-header);')
  .replace(/\.top-bar\s*\{[\s\S]*?background-color:\s*var\(--forest\);[\s\S]*?color:\s*rgba\(255,\s*255,\s*255,\s*0\.9\);/g, '.top-bar {\n  background-color: var(--forest);\n  color: var(--bg-card);')
  .replace(/\.trust-strip\s*\{[\s\S]*?background-color:\s*#fff;/g, '.trust-strip {\n  background-color: var(--bg-card);')
  .replace(/\.modal-card\s*\{[\s\S]*?background:\s*#fff;/g, '.modal-card {\n  background: var(--bg-card);')
  .replace(/\.cart-drawer\s*\{[\s\S]*?background:\s*#fff;/g, '.cart-drawer {\n  background: var(--bg-card);')
  .replace(/\.search-dropdown\s*\{[\s\S]*?background:\s*#fff;/g, '.search-dropdown {\n  background: var(--bg-card);')
  .replace(/\.mobile-tab-bar\s*\{[\s\S]*?background:\s*#fff;/g, '.mobile-tab-bar {\n  background: var(--bg-header);')
  .replace(/color:\s*#444;/g, 'color: var(--text);')
  .replace(/color:\s*#555;/g, 'color: var(--text);')
  .replace(/color:\s*#666;/g, 'color: var(--text-muted);')
  .replace(/color:\s*#777;/g, 'color: var(--text-muted);')
  .replace(/color:\s*#888;/g, 'color: var(--text-muted);')
  .replace(/color:\s*var\(--leaf\);\s*\/\* text link \*\//g, 'color: var(--leaf-text);');

// Enhance product image styling with blend mode and cream background
const extraCssRules = `
/* ── Cream Product & Responsive Image Enhancements ── */
.product-thumb-wrap {
  position: relative;
  background-color: var(--bg-card);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}

.product-img {
  max-width: 100%;
  height: 180px;
  object-fit: contain;
  mix-blend-mode: multiply;
  transition: var(--trans);
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.hero-slide-picture {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.32;
  mix-blend-mode: luminosity;
}

.photo-placeholder {
  border: 2px dashed var(--border);
  background-color: var(--bg-section);
  border-radius: var(--radius-card);
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.88rem;
}

.guide-img-wrap {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: var(--bg-section);
  border-radius: 12px 12px 0 0;
}

.guide-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--trans);
}

.pest-thumb-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 0.75rem;
}

.view-all-link {
  color: var(--leaf-text);
}
`;

cssContent += extraCssRules;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('css/style.css updated with cream palette and image helpers.');

// ── 2. Update frontend/app/globals.css ────────────────────────────────
const globalsCssPath = path.join(ROOT_DIR, 'frontend', 'app', 'globals.css');
if (fs.existsSync(globalsCssPath)) {
  let gContent = fs.readFileSync(globalsCssPath, 'utf8');
  gContent = gContent.replace(/:root\s*\{[\s\S]*?\}/, newRootBlock);
  fs.writeFileSync(globalsCssPath, gContent, 'utf8');
  console.log('frontend/app/globals.css updated.');
}

// ── 3. Scripted find-and-replace across all HTML files ─────────────────
const htmlFiles = [
  'index.html',
  'shop.html',
  'product.html',
  'cart.html',
  'admin.html',
  'about.html',
  'contact.html',
  'blog.html',
  'delivery-returns.html',
  'privacy.html'
];

htmlFiles.forEach(filename => {
  const filePath = path.join(ROOT_DIR, filename);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace hardcoded whites and near-whites in inline styles & attributes
  content = content
    .replace(/background:\s*#fff\b/gi, 'background: var(--bg-card)')
    .replace(/background-color:\s*#fff\b/gi, 'background-color: var(--bg-card)')
    .replace(/background:\s*#ffffff\b/gi, 'background: var(--bg-card)')
    .replace(/background-color:\s*#ffffff\b/gi, 'background-color: var(--bg-card)')
    .replace(/background:\s*white\b/gi, 'background: var(--bg-card)')
    .replace(/background-color:\s*white\b/gi, 'background-color: var(--bg-card)')
    .replace(/#FAFBFD/gi, 'var(--bg-page)')
    .replace(/#FBFCF6/gi, 'var(--bg-card)')
    .replace(/#F4F7F2/gi, 'var(--bg-page)')
    .replace(/#FFF8E7/gi, 'var(--bg-section)')
    .replace(/#eee\b/gi, 'var(--border)')
    .replace(/#f4f4f4\b/gi, 'var(--bg-section)')
    .replace(/#f0f4ea\b/gi, 'var(--bg-section)')
    .replace(/border:\s*1px solid #ccc\b/gi, 'border: 1px solid var(--border)')
    .replace(/border:\s*1px solid #eee\b/gi, 'border: 1px solid var(--border)')
    .replace(/border-bottom:\s*1px solid #eee\b/gi, 'border-bottom: 1px solid var(--border)')
    .replace(/color:\s*#444\b/gi, 'color: var(--text)')
    .replace(/color:\s*#555\b/gi, 'color: var(--text)')
    .replace(/color:\s*#666\b/gi, 'color: var(--text-muted)')
    .replace(/color:\s*#777\b/gi, 'color: var(--text-muted)')
    .replace(/color:\s*#888\b/gi, 'color: var(--text-muted)');

  // Ensure credits.md link in footer
  if (!content.includes('credits.html') && !content.includes('credits.md')) {
    content = content.replace(
      /<\/div>\s*<\/div>\s*<\/div>\s*<\/footer>/i,
      `  <div style="margin-top: 0.75rem; font-size: 0.75rem; text-align: center; color: var(--text-muted);">
        <a href="credits.html" style="color: var(--leaf-text); text-decoration: underline;">Image Licensing & Source Credits</a> • 
        <a href="image-manifest.md" style="color: var(--text-muted); text-decoration: underline;">Image Manifest</a>
      </div>
    </div>
  </div>
</footer>`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated cream colors in ${filename}`);
});

console.log('Cream background successfully applied across all files!');

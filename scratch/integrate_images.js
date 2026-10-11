const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'c:/Users/user/OneDrive/agrovet.ltd farm';

// ── 1. Update index.html ───────────────────────────────────────────────
let indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

// Replace hero slides visual placeholders with rich picture tags
const heroSlide1 = `<div class="hero-slide active">
          <picture class="hero-slide-picture">
            <source srcset="images/hero/hero-cropprotection.webp" type="image/webp">
            <img class="hero-bg-img" src="images/hero/hero-cropprotection.webp" width="1600" height="700" alt="Farmer applying crop protection chemical with protective equipment in Kenyan farm" fetchpriority="high">
          </picture>
          <div class="hero-content">
            <span class="label-caps gold">YOUR TRUSTED FARM PARTNER</span>
            <h1 class="hero-headline">Quality Farm Inputs Delivered Across Kenya</h1>
            <p class="hero-subtext">Certified herbicides, insecticides, fungicides, seeds and fertilizers. Sourced from genuine manufacturers, delivered directly to your farm.</p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="shop.html" class="btn btn-gold btn-lg">Shop Now →</a>
              <a href="https://wa.me/254700000000?text=Hello%20Agrovet%20Ltd" target="_blank" class="btn btn-outline-white btn-lg">WhatsApp Order</a>
            </div>
          </div>
        </div>`;

const heroSlide2 = `<div class="hero-slide">
          <picture class="hero-slide-picture">
            <source srcset="images/hero/hero-media.webp" type="image/webp">
            <img class="hero-bg-img" src="images/hero/hero-media.webp" width="1600" height="700" alt="Sterile peat moss growing media with healthy seedling nursery trays in Kenya" loading="lazy">
          </picture>
          <div class="hero-content">
            <span class="label-caps gold">PREMIUM GROWING MEDIA</span>
            <h1 class="hero-headline">Peat Moss & Planting Media for Stronger Seedlings</h1>
            <p class="hero-subtext">Give your nursery the best start with imported sterile Baltic sphagnum peat moss and washed coco peat. Zero nematodes, 98% germination.</p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="shop.html?cat=planting-media" class="btn btn-gold btn-lg">Shop Planting Media →</a>
              <a href="blog.html" class="btn btn-outline-white btn-lg">Nursery Guide</a>
            </div>
          </div>
        </div>`;

const heroSlide3 = `<div class="hero-slide">
          <picture class="hero-slide-picture">
            <source srcset="images/hero/hero-vegetables.webp" type="image/webp">
            <img class="hero-bg-img" src="images/hero/hero-vegetables.webp" width="1600" height="700" alt="High-germination vegetable seeds showing vigorous tomato and sukuma wiki crop" loading="lazy">
          </picture>
          <div class="hero-content">
            <span class="label-caps gold">SEASON-READY HYBRID SEEDS</span>
            <h1 class="hero-headline">High-Germination Vegetable Seeds — Plant for Yield</h1>
            <p class="hero-subtext">KEPHIS-certified hybrid tomato, cabbage, onion, capsicum, and spinach seeds. Tested germination rates printed on every pack.</p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="shop.html?cat=seeds" class="btn btn-gold btn-lg">Browse Seeds →</a>
              <a href="shop.html" class="btn btn-outline-white btn-lg">All Products</a>
            </div>
          </div>
        </div>`;

const heroSlide4 = `<div class="hero-slide">
          <picture class="hero-slide-picture">
            <source srcset="images/hero/hero-fertilizer.webp" type="image/webp">
            <img class="hero-bg-img" src="images/hero/hero-fertilizer.webp" width="1600" height="700" alt="Kenyan farmer applying granular NPK fertilizer to crop rows for maximum yield" loading="lazy">
          </picture>
          <div class="hero-content">
            <span class="label-caps gold">MAXIMIZE YOUR HARVEST</span>
            <h1 class="hero-headline">Granular & Foliar Fertilizers for Every Crop Stage</h1>
            <p class="hero-subtext">Balanced NPK blends, soluble foliar micronutrients, and soil amendments for vigorous root branching and heavy fruit set.</p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="shop.html?cat=fertilizers" class="btn btn-gold btn-lg">Shop Fertilizers →</a>
              <a href="#crop-solver" class="btn btn-outline-white btn-lg">Nutrient Diagnostic</a>
            </div>
          </div>
        </div>`;

const heroSlide5 = `<div class="hero-slide">
          <picture class="hero-slide-picture">
            <source srcset="images/hero/hero-maize.webp" type="image/webp">
            <img class="hero-bg-img" src="images/hero/hero-maize.webp" width="1600" height="700" alt="Healthy green hybrid maize field with heavy filled cobs in Kenyan highlands" loading="lazy">
          </picture>
          <div class="hero-content">
            <span class="label-caps gold">HIGH-YIELD MAIZE</span>
            <h1 class="hero-headline">Certified Hybrid Maize Seed — Plant with Confidence</h1>
            <p class="hero-subtext">Certified varieties suited for Kenyan highland and mid-altitude zones. Bred for drought tolerance, stalk strength, and heavy cob fill.</p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="shop.html?cat=seeds" class="btn btn-gold btn-lg">View Maize Varieties →</a>
            </div>
          </div>
        </div>`;

// Replace hero slides in indexHtml
indexHtml = indexHtml.replace(/<div class="hero-slide active">[\s\S]*?<div class="hero-visual-bg"><\/div>\s*<\/div>/, heroSlide1);
indexHtml = indexHtml.replace(/<div class="hero-slide">[\s\S]*?Peat Moss & Planting Media[\s\S]*?<div class="hero-visual-bg"><\/div>\s*<\/div>/, heroSlide2);
indexHtml = indexHtml.replace(/<div class="hero-slide">[\s\S]*?High-Germination Vegetable Seeds[\s\S]*?<div class="hero-visual-bg"><\/div>\s*<\/div>/, heroSlide3);
indexHtml = indexHtml.replace(/<div class="hero-slide">[\s\S]*?Granular & Foliar Fertilizers[\s\S]*?<div class="hero-visual-bg"><\/div>\s*<\/div>/, heroSlide4);
indexHtml = indexHtml.replace(/<div class="hero-slide">[\s\S]*?Certified Hybrid Maize Seed[\s\S]*?<div class="hero-visual-bg"><\/div>\s*<\/div>/, heroSlide5);

// Update Product Card thumbnails in index.html with real product images and mix-blend-mode: multiply
indexHtml = indexHtml.replace(
  /<div class="product-thumb-wrap" onclick="window\.AgrovetApp\.openQuickView\('p1'\)">[\s\S]*?<\/div>/,
  `<div class="product-thumb-wrap" onclick="window.AgrovetApp.openQuickView('p1')">
            <img src="images/products/sample-herbicide-glyphosate-front.webp" class="product-img" width="300" height="300" alt="SAMPLE Herbicide — Glyphosate 360 SL bottle with official label" loading="lazy">
          </div>`
);

indexHtml = indexHtml.replace(
  /<div class="product-thumb-wrap" onclick="window\.AgrovetApp\.openQuickView\('p2'\)">[\s\S]*?<\/div>/,
  `<div class="product-thumb-wrap" onclick="window.AgrovetApp.openQuickView('p2')">
            <img src="images/products/sample-insecticide-lambda-front.webp" class="product-img" width="300" height="300" alt="SAMPLE Insecticide — Lambda-cyhalothrin 5% EC 500ml bottle with official label" loading="lazy">
          </div>`
);

indexHtml = indexHtml.replace(
  /<div class="product-thumb-wrap" onclick="window\.AgrovetApp\.openQuickView\('p3'\)">[\s\S]*?<\/div>/,
  `<div class="product-thumb-wrap" onclick="window.AgrovetApp.openQuickView('p3')">
            <img src="images/products/sample-fungicide-mancozeb-front.webp" class="product-img" width="300" height="300" alt="SAMPLE Fungicide — Mancozeb 80% WP 1kg sealed foil pack with label" loading="lazy">
          </div>`
);

indexHtml = indexHtml.replace(
  /<div class="product-thumb-wrap" onclick="window\.AgrovetApp\.openQuickView\('p4'\)">[\s\S]*?<\/div>/,
  `<div class="product-thumb-wrap" onclick="window.AgrovetApp.openQuickView('p4')">
            <img src="images/products/sample-tomato-seed-f1-front.webp" class="product-img" width="300" height="300" alt="SAMPLE Tomato Seed — F1 Hybrid High-Yield 50g certified seed pack" loading="lazy">
          </div>`
);

indexHtml = indexHtml.replace(
  /<div class="product-thumb-wrap" onclick="window\.AgrovetApp\.openQuickView\('p5'\)">[\s\S]*?<\/div>/,
  `<div class="product-thumb-wrap" onclick="window.AgrovetApp.openQuickView('p5')">
            <img src="images/products/sample-npk-fertilizer-front.webp" class="product-img" width="300" height="300" alt="SAMPLE Granular Fertilizer — NPK 17:17:17 Balanced 25kg bag" loading="lazy">
          </div>`
);

indexHtml = indexHtml.replace(
  /<div class="product-thumb-wrap" onclick="window\.AgrovetApp\.openQuickView\('p6'\)">[\s\S]*?<\/div>/,
  `<div class="product-thumb-wrap" onclick="window.AgrovetApp.openQuickView('p6')">
            <img src="images/products/sample-knapsack-sprayer-front.webp" class="product-img" width="300" height="300" alt="SAMPLE Knapsack Sprayer — 16L Heavy Duty Manual Sprayer with brass lance" loading="lazy">
          </div>`
);

indexHtml = indexHtml.replace(
  /<div class="product-thumb-wrap" onclick="window\.AgrovetApp\.openQuickView\('p7'\)">[\s\S]*?<\/div>/,
  `<div class="product-thumb-wrap" onclick="window.AgrovetApp.openQuickView('p7')">
            <img src="images/products/sample-peat-moss-front.webp" class="product-img" width="300" height="300" alt="SAMPLE Peat Moss — Seedling Growing Medium 70L compressed bale" loading="lazy">
          </div>`
);

indexHtml = indexHtml.replace(
  /<div class="product-thumb-wrap" onclick="window\.AgrovetApp\.openQuickView\('p10'\)">[\s\S]*?<\/div>/,
  `<div class="product-thumb-wrap" onclick="window.AgrovetApp.openQuickView('p10')">
            <img src="images/products/sample-chemical-ppe-front.webp" class="product-img" width="300" height="300" alt="SAMPLE Farm Chemical PPE Complete Safety Suit, respirator, goggles and gloves" loading="lazy">
          </div>`
);

// Update Guide cards in index.html with real guide header images
indexHtml = indexHtml.replace(
  /<div class="product-thumb-wrap" style="background: var\(--pale-2\); min-height: 140px;">\s*<div style="font-size: 2\.5rem;">🐛<\/div>\s*<\/div>/,
  `<div class="guide-img-wrap"><img src="images/guides/tuta-absoluta-control.webp" class="guide-thumb-img" width="600" height="338" alt="Tuta absoluta tomato pest identification and field scouting guide" loading="lazy"></div>`
);

indexHtml = indexHtml.replace(
  /<div class="product-thumb-wrap" style="background: var\(--pale-2\); min-height: 140px;">\s*<div style="font-size: 2\.5rem;">🧪<\/div>\s*<\/div>/,
  `<div class="guide-img-wrap"><img src="images/guides/npk-fertilizer-guide.webp" class="guide-thumb-img" width="600" height="338" alt="Choosing the right NPK fertilizer ratios for crop yields" loading="lazy"></div>`
);

indexHtml = indexHtml.replace(
  /<div class="product-thumb-wrap" style="background: var\(--pale-2\); min-height: 140px;">\s*<div style="font-size: 2\.5rem;">🌱<\/div>\s*<\/div>/,
  `<div class="guide-img-wrap"><img src="images/guides/peat-moss-nursery.webp" class="guide-thumb-img" width="600" height="338" alt="Sterile Baltic sphagnum peat moss for nursery seedling propagation" loading="lazy"></div>`
);

fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), indexHtml, 'utf8');
console.log('index.html image slots updated with authentic WebP assets.');

// ── 2. Update js/data.js with image paths ──────────────────────────────
let dataJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'data.js'), 'utf8');

const imageMap = {
  p1: 'images/products/sample-herbicide-glyphosate-front.webp',
  p2: 'images/products/sample-insecticide-lambda-front.webp',
  p3: 'images/products/sample-fungicide-mancozeb-front.webp',
  p4: 'images/products/sample-tomato-seed-f1-front.webp',
  p5: 'images/products/sample-npk-fertilizer-front.webp',
  p6: 'images/products/sample-knapsack-sprayer-front.webp',
  p7: 'images/products/sample-peat-moss-front.webp',
  p8: 'images/products/sample-foliar-fertilizer-front.webp',
  p9: 'images/products/sample-bio-insecticide-front.webp',
  p10: 'images/products/sample-chemical-ppe-front.webp'
};

// Add image field to each product in js/data.js if missing
for (const [pid, imgPath] of Object.entries(imageMap)) {
  const regex = new RegExp(`(id:\\s*"${pid}"[\\s\\S]*?)(isFeatured:)`, 'g');
  dataJs = dataJs.replace(regex, `$1image: "${imgPath}",\n      $2`);
}

// Add pest images to cropSolver in js/data.js
dataJs = dataJs.replace(
  /"prob-1"([\s\S]*?)recommendedProductId:/,
  `"prob-1"$1pestImage: "images/pests/pest-aphids.webp",\n        recommendedProductId:`
);
dataJs = dataJs.replace(
  /"prob-2"([\s\S]*?)recommendedProductId:/,
  `"prob-2"$1pestImage: "images/pests/pest-blight.webp",\n        recommendedProductId:`
);
dataJs = dataJs.replace(
  /"prob-3"([\s\S]*?)recommendedProductId:/,
  `"prob-3"$1pestImage: "images/pests/pest-blight.webp",\n        recommendedProductId:`
);
dataJs = dataJs.replace(
  /"prob-4"([\s\S]*?)recommendedProductId:/,
  `"prob-4"$1pestImage: "images/pests/pest-armyworm.webp",\n        recommendedProductId:`
);
dataJs = dataJs.replace(
  /"prob-5"([\s\S]*?)recommendedProductId:/,
  `"prob-5"$1pestImage: "images/pests/pest-deficiency.webp",\n        recommendedProductId:`
);
dataJs = dataJs.replace(
  /"prob-6"([\s\S]*?)recommendedProductId:/,
  `"prob-6"$1pestImage: "images/pests/pest-weeds.webp",\n        recommendedProductId:`
);

fs.writeFileSync(path.join(ROOT_DIR, 'js', 'data.js'), dataJs, 'utf8');
console.log('js/data.js updated with product and pest image paths.');

// ── 3. Update js/app.js to render actual WebP images ──────────────────
let appJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'app.js'), 'utf8');

// In renderCartDrawerItems, replace SVG icon with product thumbnail image
appJs = appJs.replace(
  /<div class="cart-item-thumb">[\s\S]*?<\/div>/g,
  `<div class="cart-item-thumb">
          <img src="\${item.image || 'images/products/sample-herbicide-glyphosate-front.webp'}" width="50" height="50" style="object-fit: contain; mix-blend-mode: multiply;" alt="\${item.name}" loading="lazy">
        </div>`
);

// In QuickView modal, render actual product image
appJs = appJs.replace(
  /<div style="display: grid; grid-template-columns: 1fr; gap: 1\.5rem;">/g,
  `<div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
        <div style="background: var(--bg-card); border-radius: 14px; padding: 1.5rem; text-align: center; border: 1px solid var(--border);">
          <img src="\${p.image || 'images/products/' + p.slug + '-front.webp'}" style="max-height: 220px; width: auto; object-fit: contain; mix-blend-mode: multiply; margin: 0 auto;" alt="\${p.name}">
        </div>`
);

// In CropSolver, render accurate pest image
appJs = appJs.replace(
  /<h3 style="font-size: 1\.45rem; color: #fff;">Pest\/Condition: \${problem\.pest}<\/h3>/g,
  `<div style="display: flex; gap: 1rem; align-items: center; margin: 0.5rem 0;">
              \${problem.pestImage ? '<img src="' + problem.pestImage + '" width="100" height="100" style="border-radius: 10px; object-fit: cover; border: 2px solid var(--gold);" alt="' + problem.pest + '">' : ''}
              <div>
                <h3 style="font-size: 1.45rem; color: #fff;">Pest/Condition: \${problem.pest}</h3>
                <small style="color: var(--gold);">Scouting field photo reference verified</small>
              </div>
            </div>`
);

fs.writeFileSync(path.join(ROOT_DIR, 'js', 'app.js'), appJs, 'utf8');
console.log('js/app.js updated with image rendering logic.');

// ── 4. Update shop.html to render real product images ─────────────────
let shopHtml = fs.readFileSync(path.join(ROOT_DIR, 'shop.html'), 'utf8');
shopHtml = shopHtml.replace(
  /<div class="product-thumb-wrap" onclick="window\.AgrovetApp\.openQuickView\('\${p\.id}'\)">[\s\S]*?<div style="font-size: 3rem;">🌿<\/div>[\s\S]*?<\/div>/g,
  `<div class="product-thumb-wrap" onclick="window.AgrovetApp.openQuickView('\${p.id}')">
              <img src="\${p.image || 'images/products/' + p.slug + '-front.webp'}" class="product-img" width="300" height="300" alt="\${p.name} official packaging with label" loading="lazy">
            </div>`
);
fs.writeFileSync(path.join(ROOT_DIR, 'shop.html'), shopHtml, 'utf8');
console.log('shop.html updated with real product image tags.');

// ── 5. Update product.html to show actual product image ───────────────
let prodHtml = fs.readFileSync(path.join(ROOT_DIR, 'product.html'), 'utf8');
prodHtml = prodHtml.replace(
  /<div style="font-size: 6rem; margin-bottom: 1rem;" id="p-large-icon">🌿<\/div>/g,
  `<div style="width: 100%; text-align: center; margin-bottom: 1rem;" id="p-large-icon">
            <img id="p-main-img" src="images/products/sample-herbicide-glyphosate-front.webp" width="400" height="400" style="max-height: 320px; width: auto; object-fit: contain; mix-blend-mode: multiply; margin: 0 auto;" alt="Official Registered Pack" fetchpriority="high">
          </div>`
);
// Also in product.html JS script, update main image src dynamically based on slug
prodHtml = prodHtml.replace(
  /document\.getElementById\('p-title'\)\.textContent = currentProduct\.name;/g,
  `document.getElementById('p-title').textContent = currentProduct.name;
      const mainImg = document.getElementById('p-main-img');
      if (mainImg) {
        mainImg.src = currentProduct.image || ('images/products/' + currentProduct.slug + '-front.webp');
        mainImg.alt = currentProduct.name + ' - Official PCPB Registered Pack';
      }`
);
fs.writeFileSync(path.join(ROOT_DIR, 'product.html'), prodHtml, 'utf8');
console.log('product.html updated with dynamic product image showcase.');

// ── 6. Update about.html with authentic about photos ──────────────────
let aboutHtml = fs.readFileSync(path.join(ROOT_DIR, 'about.html'), 'utf8');
aboutHtml = aboutHtml.replace(
  /<div style="font-size: 2\.5rem; margin-bottom: 0\.75rem;">🛡️<\/div>/g,
  `<img src="images/about/agronomist-team.webp" width="360" height="240" style="width: 100%; height: 180px; object-fit: cover; border-radius: 12px; margin-bottom: 1rem;" alt="Agrovet Ltd licensed agronomist advisory team" loading="lazy">`
);
aboutHtml = aboutHtml.replace(
  /<div style="font-size: 2\.5rem; margin-bottom: 0\.75rem;">🚚<\/div>/g,
  `<img src="images/about/courier-dispatch.webp" width="360" height="240" style="width: 100%; height: 180px; object-fit: cover; border-radius: 12px; margin-bottom: 1rem;" alt="Agrochemical leak-proof packaging and courier dispatch across Kenya" loading="lazy">`
);
aboutHtml = aboutHtml.replace(
  /<div style="font-size: 2\.5rem; margin-bottom: 0\.75rem;">🌾<\/div>/g,
  `<img src="images/about/shop-kirinyaga-rd.webp" width="360" height="240" style="width: 100%; height: 180px; object-fit: cover; border-radius: 12px; margin-bottom: 1rem;" alt="Agrovet Ltd Kirinyaga Road Nairobi store and collection center" loading="lazy">`
);
fs.writeFileSync(path.join(ROOT_DIR, 'about.html'), aboutHtml, 'utf8');
console.log('about.html updated with authentic about photo slots.');

// ── 7. Update blog.html with guide header images ──────────────────────
let blogHtml = fs.readFileSync(path.join(ROOT_DIR, 'blog.html'), 'utf8');
const guideImgMap = [
  { match: /How to Detect and Control Tuta Absoluta on Tomatoes/i, img: 'images/guides/tuta-absoluta-control.webp', alt: 'Tuta absoluta tomato leaf mining and scouting reference' },
  { match: /Understanding NPK: Choosing the Right Fertilizer/i, img: 'images/guides/npk-fertilizer-guide.webp', alt: 'NPK granular and foliar fertilizer application guidelines' },
  { match: /Why Peat Moss Guarantees 98% Seedling Nursery Success/i, img: 'images/guides/peat-moss-nursery.webp', alt: 'Sterile peat moss propagation media for seedling nursery trays' },
  { match: /5 Maintenance Rules to Extend Your Knapsack Sprayer's Life/i, img: 'images/guides/knapsack-maintenance.webp', alt: 'Knapsack sprayer maintenance, cleaning, and nozzle care' },
  { match: /Pre-Emergent vs Post-Emergent Herbicides in Kenya/i, img: 'images/guides/herbicide-weed-control.webp', alt: 'Pre-emergent weed barriers vs selective post-emergence herbicide spraying' },
];

guideImgMap.forEach(g => {
  const regex = new RegExp(`(<article class="product-card"[^>]*>)([\\s\\S]*?${g.match.source})`, 'i');
  blogHtml = blogHtml.replace(regex, `$1\n          <div class="guide-img-wrap"><img src="${g.img}" class="guide-thumb-img" width="600" height="338" alt="${g.alt}" loading="lazy"></div>$2`);
});
fs.writeFileSync(path.join(ROOT_DIR, 'blog.html'), blogHtml, 'utf8');
console.log('blog.html updated with guide header images.');

console.log('All image integrations completed successfully!');

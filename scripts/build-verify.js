/**
 * AGROVET LTD (agrovet.ltd) — Production Build & Deployment Artifact Verification
 * Validates storefront assets, templates, API endpoints, sitemap, and manifests.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');

console.log('🌾 AGROVET LTD — Production Build Verification');
console.log('------------------------------------------------');

// 1. Check Storefront HTML pages
const requiredHtml = [
  'index.html',
  'shop.html',
  'product.html',
  'cart.html',
  'about.html',
  'contact.html',
  'blog.html',
  'delivery-returns.html',
  'terms.html',
  'privacy.html',
  'credits.html',
  '404.html',
  '500.html',
];

console.log(`[1/5] Checking ${requiredHtml.length} Storefront HTML assets...`);
for (const html of requiredHtml) {
  const p = path.join(rootDir, html);
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing critical storefront page: ${html}`);
    process.exit(1);
  }
}
console.log('   ✅ All core HTML pages are present.');

// 2. Check Admin Templates
const requiredTemplates = [
  'templates/admin-login.html',
  'templates/admin-dashboard.html',
];

console.log('\n[2/5] Checking Server-Side Admin Templates...');
for (const tmpl of requiredTemplates) {
  const p = path.join(rootDir, tmpl);
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing admin template: ${tmpl}`);
    process.exit(1);
  }
}
console.log('   ✅ Serverless admin templates present and bundled.');

// 3. Check Serverless API handlers
const requiredApis = [
  'api/orders.js',
  'api/admin.js',
  'api/mpesa-stk.js',
  'api/mpesa-callback.js',
  'api/mpesa-query.js',
  'api/order-status.js',
  'api/public-config.js',
  'api/health.js',
  'api/_db.js',
  'api/_notify.js',
  'api/_cors.js',
  'api/_rate-limit.js',
];

console.log(`\n[3/5] Checking ${requiredApis.length} Serverless API Handlers & Modules...`);
for (const api of requiredApis) {
  const p = path.join(rootDir, api);
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing API module: ${api}`);
    process.exit(1);
  }
}
console.log('   ✅ All serverless API endpoints verified.');

// 4. Validate manifest.json and sitemap.xml
console.log('\n[4/5] Verifying PWA Manifest and XML Sitemap...');
const manifestPath = path.join(rootDir, 'manifest.json');
try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!manifest.name || !manifest.icons) throw new Error('manifest.json missing name or icons');
  console.log(`   ✅ manifest.json valid (PWA App: "${manifest.name}")`);
} catch (e) {
  console.error('❌ Invalid manifest.json:', e.message);
  process.exit(1);
}

const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (!fs.existsSync(sitemapPath) || !fs.readFileSync(sitemapPath, 'utf8').includes('<urlset')) {
  console.error('❌ sitemap.xml is missing or invalid.');
  process.exit(1);
}
console.log('   ✅ sitemap.xml verified.');

// 5. JavaScript Syntax Verification
console.log('\n[5/5] Running JavaScript Syntax Checks...');
const { execSync } = require('child_process');
try {
  execSync('node scripts/lint.js', { stdio: 'inherit', cwd: rootDir });
} catch (e) {
  console.error('❌ Build failed during syntax check.');
  process.exit(1);
}

console.log('\n================================================');
console.log('🎉 PRODUCTION BUILD VALIDATION PASSED 100%!');
console.log('   Agrovet Ltd storefront & backend ready for deployment.');
console.log('================================================');
process.exit(0);

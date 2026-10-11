const fs = require('fs');
const path = require('path');

const criticalStyle = `  <!-- Critical Warm Cream Theme Inlined for Zero-Flash & Cache Immunity -->
  <style>
    :root {
      --bg-page:     #E6DFCD;
      --bg-section:  #DDD5C0;
      --bg-card:     #F2EDDF;
      --bg-header:   #EFE9D9;
      --border:      #C9BFA6;
      --text:        #2A2A1E;
      --text-muted:  #5E5A48;
      --leaf-text:   #3F7A08;
      --forest:      #223F21;
      --forest-2:    #265626;
      --ink-green:   #2D4D28;
      --leaf:        #5FA30E;
      --leaf-2:      #78B534;
      --gold:        #F4B943;
      --gold-hover:  #e5a930;
      --pale:        #DDD5C0;
      --pale-2:      #F2EDDF;
      --page:        #E6DFCD;
      --card:        #F2EDDF;
      --idle:        #B5AA90;
      --whatsapp:    #25D366;
      --danger:      #D9381E;
      --success:     #1E824C;
      --border-card: #C9BFA6;
    }
    html {
      background-color: #E6DFCD !important;
    }
    body {
      background-color: #E6DFCD !important;
      color: #2A2A1E !important;
    }
    .site-header {
      background-color: #F2EDDF !important;
    }
    .main-header, .top-bar {
      /* inherit warm system */
    }
  </style>`;

const htmlFiles = [
  'about.html',
  'admin.html',
  'blog.html',
  'cart.html',
  'contact.html',
  'credits.html',
  'delivery-returns.html',
  'index.html',
  'privacy.html',
  'product.html',
  'shop.html'
];

htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // 1. Remove previous critical style if present to avoid duplication
  html = html.replace(/\s*<!-- Critical Warm Cream Theme Inlined[\s\S]*?<\/style>/g, '');

  // 2. Cache-bust style.css link
  html = html.replace(/href=["']css\/style\.css(?:\?[^"']*)?["']/g, 'href="css/style.css?v=cream-2026"');

  // 3. Inject critical style right before </head>
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${criticalStyle}\n</head>`);
  }

  // 4. Clean up any accidental inline white styles
  html = html.replace(/background(-color)?\s*:\s*(#ffffff|#fff|white)\b/gi, 'background$1: var(--bg-card)');

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Updated ${file}`);
});
console.log('All HTML files updated successfully with critical cream inline style & cache-busting.');

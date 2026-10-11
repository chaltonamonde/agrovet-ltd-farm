const fs = require('fs');
const path = require('path');

// 1. Update frontend/app/globals.css
const globalsCssPath = 'frontend/app/globals.css';
if (fs.existsSync(globalsCssPath)) {
  let css = fs.readFileSync(globalsCssPath, 'utf8');

  // Ensure @theme inline maps --color-white to var(--card)
  css = css.replace(/@theme inline \{([\s\S]*?)\}/, (match, body) => {
    if (!body.includes('--color-white')) {
      return `@theme inline {\n  --color-white:     var(--card);\n  --color-cream-page: var(--bg-page);\n  --color-cream-card: var(--bg-card);\n  --color-cream-section: var(--bg-section);\n  --color-cream-header: var(--bg-header);${body}}`;
    }
    return match;
  });

  // Ensure html and body have !important cream background
  css = css.replace(/html \{ scroll-behavior: smooth; \}/, 'html {\n  scroll-behavior: smooth;\n  background-color: var(--bg-page) !important;\n}');
  css = css.replace(/body \{[\s\S]*?overflow-x: hidden;\s*\}/, `body {
  background-color: var(--bg-page) !important;
  color: var(--text) !important;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}`);

  // Add utility class safeguard
  if (!css.includes('.bg-white {')) {
    css += `\n\n/* Cream Theme Safeguard: Override legacy bg-white to warm cream card */\n.bg-white {\n  background-color: var(--bg-card) !important;\n}\n`;
  }

  fs.writeFileSync(globalsCssPath, css, 'utf8');
  console.log('Updated frontend/app/globals.css');
}

// 2. Search and replace bg-white in frontend components where appropriate
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const frontendCodeFiles = walk('frontend');
frontendCodeFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Replace bg-white with bg-card for containers/sections/cards, while leaving text-white or white/10 untouched
  // Replace className="... bg-white ..." with bg-card
  content = content.replace(/(className=["'][^"']*?\b)bg-white(\b[^"']*?["'])/g, '$1bg-card$2');
  // In ProductRail default prop
  content = content.replace(/bgClass\s*=\s*['"]bg-white['"]/g, 'bgClass = "bg-card"');

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log(`Updated classes in ${f}`);
  }
});

console.log('Finished updating frontend files.');

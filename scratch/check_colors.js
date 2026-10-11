const fs = require('fs');
const path = require('path');

// 1. Check all HTML files
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log('--- Checking HTML files ---');
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasStyleTag = content.includes('<style>');
  const styleMatches = content.match(/background(?:-color)?\s*:\s*(?:#fff|white|#ffffff)/gi);
  if (styleMatches) {
    console.log(`HTML ${f} has matches:`, styleMatches);
  }
});

// 2. Check css/style.css
const css = fs.readFileSync('css/style.css', 'utf8');
const rootMatch = css.match(/:root\s*\{[^}]+\}/);
console.log('\n--- css/style.css :root ---');
if (rootMatch) {
  console.log(rootMatch[0].substring(0, 300));
}

// Check body in css/style.css
const bodyMatch = css.match(/body\s*\{[^}]+\}/);
console.log('\n--- css/style.css body ---');
if (bodyMatch) {
  console.log(bodyMatch[0]);
}

// 3. Check frontend/app/globals.css
if (fs.existsSync('frontend/app/globals.css')) {
  const fg = fs.readFileSync('frontend/app/globals.css', 'utf8');
  console.log('\n--- frontend/app/globals.css body & theme ---');
  const fgRoot = fg.match(/:root\s*\{[^}]+\}/);
  if (fgRoot) console.log(fgRoot[0].substring(0, 250));
  const fgTheme = fg.match(/@theme\s+inline\s*\{[^}]+\}/);
  if (fgTheme) console.log(fgTheme[0]);
}

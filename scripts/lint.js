/**
 * AGROVET LTD (agrovet.ltd) — Cross-Platform JavaScript Syntax & Linter Checker
 * Runs syntax checking across all server and script files.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function checkFileSyntax(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    // If file has ESM syntax (export / import), test with SourceTextModule or transform check
    if (code.includes('export ') || code.includes('import ')) {
      // In Node.js, we can use vm.SourceTextModule if enabled or parse via native import check
      new vm.Script(code.replace(/export\s+(default\s+|const\s+|let\s+|function\s+|class\s+)/g, 'var '), {
        filename: path.basename(filePath),
      });
    } else {
      new vm.Script(code, { filename: path.basename(filePath) });
    }
    return { ok: true, file: filePath };
  } catch (err) {
    return { ok: false, file: filePath, error: err.message };
  }
}

function scanDir(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'backups') {
        results = results.concat(scanDir(full));
      }
    } else if (f.endsWith('.js')) {
      results.push(full);
    }
  }
  return results;
}

const rootFiles = ['server.js'];
const dirs = ['api', 'scripts', 'src', 'js'];
let allJsFiles = rootFiles
  .map((f) => path.join(__dirname, '..', f))
  .filter((f) => fs.existsSync(f));

for (const d of dirs) {
  const dirPath = path.join(__dirname, '..', d);
  if (fs.existsSync(dirPath)) {
    allJsFiles = allJsFiles.concat(scanDir(dirPath));
  }
}

console.log(`Checking syntax across ${allJsFiles.length} JavaScript files...`);
let hasErrors = false;

for (const file of allJsFiles) {
  const check = checkFileSyntax(file);
  if (!check.ok) {
    console.error(`❌ Syntax Error in ${path.relative(path.join(__dirname, '..'), file)}: ${check.error}`);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error('\n❌ Linting failed: syntax errors detected.');
  process.exit(1);
} else {
  console.log(`✅ All ${allJsFiles.length} JavaScript files passed syntax verification with 0 errors!`);
  process.exit(0);
}

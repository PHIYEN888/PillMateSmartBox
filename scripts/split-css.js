const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const cssPath = path.join(rootDir, 'css', 'style.css');
const modulesDir = path.join(rootDir, 'css', 'modules');

if (!fs.existsSync(modulesDir)) {
  fs.mkdirSync(modulesDir, { recursive: true });
}

const css = fs.readFileSync(cssPath, 'utf8');

function extractBetween(startPattern, endPattern, includeStart = true, includeEnd = false) {
  const startIdx = css.indexOf(startPattern);
  if (startIdx === -1) {
    console.error('Pattern not found: ' + startPattern);
    return '';
  }
  const actualStart = includeStart ? startIdx : startIdx + startPattern.length;
  if (!endPattern) {
    return css.substring(actualStart).trim();
  }
  const endIdx = css.indexOf(endPattern, actualStart);
  if (endIdx === -1) {
    console.error('End pattern not found: ' + endPattern);
    return '';
  }
  const actualEnd = includeEnd ? endIdx + endPattern.length : endIdx;
  return css.substring(actualStart, actualEnd).trim();
}

// 1. variables.css
const variables = extractBetween(':root {', '/* ==========================================================================\n   Header & Sticky Navigation');
fs.writeFileSync(path.join(modulesDir, 'variables.css'), '/* Design Tokens & Theme Variables */\n' + variables + '\n', 'utf8');

// 2. header.css (header + sliding pill toggle)
const header = extractBetween('/* ==========================================================================\n   Header & Sticky Navigation', '/* ==========================================================================\n   Page Switcher / Views Setup');
fs.writeFileSync(path.join(modulesDir, 'header.css'), header + '\n', 'utf8');

// 3. base.css (page switcher + base elements)
const base = extractBetween('/* ==========================================================================\n   Page Switcher / Views Setup', '/* ==========================================================================\n   Hero Section');
fs.writeFileSync(path.join(modulesDir, 'base.css'), base + '\n', 'utf8');

// 4. hero.css (Hero, highlights, stats, workflow, testimonials, faq)
const heroPart1 = extractBetween('/* ==========================================================================\n   Hero Section', '/* ==========================================================================\n   Product Page & Interactive Smart Box Simulator');
const heroPart2 = extractBetween('/* ==========================================================================\n   Customer Testimonials & Medical Advisory', '/* ==========================================================================\n   About Page');
fs.writeFileSync(path.join(modulesDir, 'hero.css'), heroPart1 + '\n\n' + heroPart2 + '\n', 'utf8');

// 5. product.css (simulator, slots, pricing)
const productPart1 = extractBetween('/* ==========================================================================\n   Product Page & Interactive Smart Box Simulator', '/* ==========================================================================\n   Features Detailed Grid');
const productPart2 = extractBetween('/* ==========================================================================\n   Pricing & Packages', '/* ==========================================================================\n   Customer Testimonials & Medical Advisory');
fs.writeFileSync(path.join(modulesDir, 'product.css'), productPart1 + '\n\n' + productPart2 + '\n', 'utf8');

// 6. features.css
const features = extractBetween('/* ==========================================================================\n   Features Detailed Grid', '/* ==========================================================================\n   AI Assistant Page & Interactive Chat');
fs.writeFileSync(path.join(modulesDir, 'features.css'), features + '\n', 'utf8');

// 7. ai.css
const ai = extractBetween('/* ==========================================================================\n   AI Assistant Page & Interactive Chat', '/* ==========================================================================\n   Pricing & Packages');
fs.writeFileSync(path.join(modulesDir, 'ai.css'), ai + '\n', 'utf8');

// 8. about.css (About hero + core leadership team cards)
const about = extractBetween('/* ==========================================================================\n   About Page', '/* ==========================================================================\n   Consultation Modal & Floating Notification Toast');
fs.writeFileSync(path.join(modulesDir, 'about.css'), about + '\n', 'utf8');

// 9. modal.css
const modal = extractBetween('/* ==========================================================================\n   Consultation Modal & Floating Notification Toast', '/* ==========================================================================\n   Footer');
fs.writeFileSync(path.join(modulesDir, 'modal.css'), modal + '\n', 'utf8');

// 10. footer.css
const footer = extractBetween('/* ==========================================================================\n   Footer', '/* ==========================================================================\n   Responsive Breakpoints & Mobile Adaptability');
fs.writeFileSync(path.join(modulesDir, 'footer.css'), footer + '\n', 'utf8');

// 11. responsive.css
const responsive = extractBetween('/* ==========================================================================\n   Responsive Breakpoints & Mobile Adaptability', null);
fs.writeFileSync(path.join(modulesDir, 'responsive.css'), responsive + '\n', 'utf8');

console.log('✅ Successfully extracted 11 modular CSS files into /css/modules!');

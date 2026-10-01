const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const sectionsDir = path.join(rootDir, 'sections');

if (!fs.existsSync(sectionsDir)) {
  fs.mkdirSync(sectionsDir, { recursive: true });
}

const html = fs.readFileSync(indexPath, 'utf8');

function extractBetween(startPattern, endPattern, includeStart = true, includeEnd = true) {
  const startIdx = html.indexOf(startPattern);
  if (startIdx === -1) {
    console.error('Pattern not found: ' + startPattern);
    return '';
  }
  const actualStart = includeStart ? startIdx : startIdx + startPattern.length;
  const endIdx = html.indexOf(endPattern, actualStart);
  if (endIdx === -1) {
    console.error('End pattern not found: ' + endPattern);
    return '';
  }
  const actualEnd = includeEnd ? endIdx + endPattern.length : endIdx;
  return html.substring(actualStart, actualEnd).trim();
}

// 1. Header
const header = extractBetween('<header class="header">', '</header>');
fs.writeFileSync(path.join(sectionsDir, 'header.html'), header + '\n', 'utf8');

// 2. Home view
const home = extractBetween('<section id="view-home"', '<!-- ======================================================================\n         PAGE 2: PRODUCT', true, false);
fs.writeFileSync(path.join(sectionsDir, 'home.html'), home + '\n', 'utf8');

// 3. Product view
const product = extractBetween('<section id="view-product"', '<!-- ======================================================================\n         PAGE 3: FEATURES', true, false);
fs.writeFileSync(path.join(sectionsDir, 'product.html'), product + '\n', 'utf8');

// 4. Features view
const features = extractBetween('<section id="view-features"', '<!-- ======================================================================\n         PAGE 4: AI ASSISTANT', true, false);
fs.writeFileSync(path.join(sectionsDir, 'features.html'), features + '\n', 'utf8');

// 5. AI view
const ai = extractBetween('<section id="view-ai"', '<!-- ======================================================================\n         PAGE 5: ABOUT', true, false);
fs.writeFileSync(path.join(sectionsDir, 'ai.html'), ai + '\n', 'utf8');

// 6. About view
const about = extractBetween('<section id="view-about"', '</main>', true, false);
fs.writeFileSync(path.join(sectionsDir, 'about.html'), about + '\n', 'utf8');

// 7. Modal & Toast
const modal = extractBetween('<div class="modal-overlay" id="order-modal">', '<footer class="footer">', true, false);
fs.writeFileSync(path.join(sectionsDir, 'modal.html'), modal + '\n', 'utf8');

// 8. Footer
const footer = extractBetween('<footer class="footer">', '</footer>');
fs.writeFileSync(path.join(sectionsDir, 'footer.html'), footer + '\n', 'utf8');

console.log('Successfully extracted all 8 clean modular sections into /sections!');

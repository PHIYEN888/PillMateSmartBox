const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sectionsDir = path.join(rootDir, 'sections');

// Load section partials
const header = fs.readFileSync(path.join(sectionsDir, 'header.html'), 'utf8');
const home = fs.readFileSync(path.join(sectionsDir, 'home.html'), 'utf8');
const product = fs.readFileSync(path.join(sectionsDir, 'product.html'), 'utf8');
const features = fs.readFileSync(path.join(sectionsDir, 'features.html'), 'utf8');
const ai = fs.readFileSync(path.join(sectionsDir, 'ai.html'), 'utf8');
const about = fs.readFileSync(path.join(sectionsDir, 'about.html'), 'utf8');
const modal = fs.readFileSync(path.join(sectionsDir, 'modal.html'), 'utf8');
const footer = fs.readFileSync(path.join(sectionsDir, 'footer.html'), 'utf8');

function getHead(title, description) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="PillMate, hộp thuốc thông minh, nhắc uống thuốc, chăm sóc sức khỏe người cao tuổi, trợ lý y tế AI, IoT y tế">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="assets/logo-transparent.png">

  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
`;
}

function getHeaderWithActive(activeTarget) {
  let nav = header;
  // Clear any existing active class on nav links
  nav = nav.replace(/class="nav-link active"/g, 'class="nav-link"');
  // Add active to current target
  const targetPattern = new RegExp(`(class="nav-link"[^>]*data-target="${activeTarget}")`, 'g');
  nav = nav.replace(targetPattern, '$1 class="nav-link active"');
  // Fix double class if occurred
  nav = nav.replace(/class="nav-link"\s*class="nav-link active"/g, 'class="nav-link active"');
  return nav;
}

const tail = `
  ${modal}

  ${footer}

  <script type="module" src="js/app.js"></script>
</body>
</html>
`;

// 1. Build index.html (Main full SPA page)
const indexContent = `${getHead('PillMate – Người trợ lý chăm sóc sức khỏe tại nhà | Hộp thuốc thông minh IoT & AI', 'PillMate - Giải pháp hộp thuốc thông minh và trợ lý y tế AI tại nhà. Nhắc nhở uống thuốc chính xác, cảnh báo quên liều, kết nối gia đình và theo dõi tuân thủ điều trị.')}
  ${getHeaderWithActive('view-home')}

  <main>
    ${home}

    ${product}

    ${features}

    ${ai}

    ${about}
  </main>
${tail}`;

fs.writeFileSync(path.join(rootDir, 'index.html'), indexContent, 'utf8');

// 2. Build product.html
const productContent = `${getHead('Sản Phẩm Hộp Thuốc Thông Minh PillMate Pro & Core | PillMate', 'Khám phá các dòng hộp thuốc thông minh PillMate Pro, PillMate Core và giải pháp y tế số dành cho bệnh viện & viện dưỡng lão.')}
  ${getHeaderWithActive('view-product')}

  <main>
    ${product.replace('class="view-section"', 'class="view-section active"')}
  </main>
${tail}`;

fs.writeFileSync(path.join(rootDir, 'product.html'), productContent, 'utf8');

// 3. Build features.html
const featuresContent = `${getHead('Tính Năng Vượt Trội Hộp Thuốc Thông Minh IoT PillMate', 'Công nghệ nhắc giờ uống thuốc đa kênh, đèn LED chỉ dẫn, cảm biến mở nắp chống nhầm lẫn và ứng dụng kết nối gia đình từ xa.')}
  ${getHeaderWithActive('view-features')}

  <main>
    ${features.replace('class="view-section"', 'class="view-section active"')}
  </main>
${tail}`;

fs.writeFileSync(path.join(rootDir, 'features.html'), featuresContent, 'utf8');

// 4. Build ai.html
const aiContent = `${getHead('Trợ Lý AI Y Tế PillMate – Tư Vấn & Quản Lý Toa Thuốc (Groq Cloud)', 'Hỏi đáp lịch trình, gợi ý thời gian uống tối ưu, phân tích tương tác thuốc và hỗ trợ xử lý tình huống quên liều siêu tốc cùng Groq AI.')}
  ${getHeaderWithActive('view-ai')}

  <main>
    ${ai.replace('class="view-section"', 'class="view-section active"')}
  </main>
${tail}`;

fs.writeFileSync(path.join(rootDir, 'ai.html'), aiContent, 'utf8');

// 5. Build about.html
const aboutContent = `${getHead('Về Chúng Tôi – Đội Ngũ Phát Triển Nòng Cốt PillMate', 'Hành trình kiến tạo vì một thế hệ người cao tuổi an yên. Gặp gỡ ban lãnh đạo và đội ngũ phát triển nòng cốt PillMate.')}
  ${getHeaderWithActive('view-about')}

  <main>
    ${about.replace('class="view-section"', 'class="view-section active"')}
  </main>
${tail}`;

fs.writeFileSync(path.join(rootDir, 'about.html'), aboutContent, 'utf8');

console.log('✅ Successfully built index.html and standalone pages: product.html, features.html, ai.html, about.html!');

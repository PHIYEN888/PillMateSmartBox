const http = require('http');

const urls = [
  'http://localhost:5173/',
  'http://localhost:5173/index.html',
  'http://localhost:5173/product.html',
  'http://localhost:5173/features.html',
  'http://localhost:5173/ai.html',
  'http://localhost:5173/about.html',
  'http://localhost:5173/css/style.css',
  'http://localhost:5173/css/modules/variables.css',
  'http://localhost:5173/css/modules/base.css',
  'http://localhost:5173/css/modules/header.css',
  'http://localhost:5173/css/modules/hero.css',
  'http://localhost:5173/css/modules/product.css',
  'http://localhost:5173/css/modules/features.css',
  'http://localhost:5173/css/modules/ai.css',
  'http://localhost:5173/css/modules/about.css',
  'http://localhost:5173/css/modules/modal.css',
  'http://localhost:5173/css/modules/footer.css',
  'http://localhost:5173/css/modules/responsive.css',
  'http://localhost:5173/js/app.js',
  'http://localhost:5173/js/modules/theme.js',
  'http://localhost:5173/js/modules/navigation.js',
  'http://localhost:5173/js/modules/toast.js',
  'http://localhost:5173/js/modules/simulator.js',
  'http://localhost:5173/js/modules/ai-assistant.js',
  'http://localhost:5173/js/modules/faq.js',
  'http://localhost:5173/js/modules/modal.js',
  'http://localhost:5173/api/status'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const ok = res.statusCode === 200;
        console.log(`${ok ? '✅' : '❌'} [${res.statusCode}] ${url} (${data.length} bytes)`);
        resolve(ok);
      });
    }).on('error', err => {
      console.log(`❌ [ERROR] ${url}: ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  console.log('Testing PillMate endpoints on http://localhost:5173...\n');
  let allOk = true;
  for (const url of urls) {
    const ok = await checkUrl(url);
    if (!ok) allOk = false;
  }
  if (allOk) {
    console.log('\n🎉 ALL 27 ENDPOINTS RETURNED HTTP 200 OK!');
  } else {
    console.log('\n⚠️ Some endpoints failed.');
    process.exit(1);
  }
}

run();

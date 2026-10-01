const http = require('http');
const fs = require('fs');
const path = require('path');

// Auto load .env if present
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] || '';
        value = value.trim().replace(/^['"]|['"]$/g, '');
        process.env[match[1]] = value;
      }
    });
  }
}
loadEnv();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Endpoint: Check Groq API status
  if (req.method === 'GET' && pathname === '/api/status') {
    loadEnv();
    const hasKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().startsWith('gsk_'));
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      groqReady: hasKey,
      model: process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
      maskedKey: hasKey ? `${process.env.GROQ_API_KEY.slice(0, 7)}...${process.env.GROQ_API_KEY.slice(-4)}` : null
    }));
    return;
  }

  // Endpoint: Save Groq API Key
  if (req.method === 'POST' && pathname === '/api/set-key') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const newKey = (payload.apiKey || '').trim();
        const newModel = (payload.model || 'llama-3.3-70b-versatile').trim();

        if (!newKey) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ success: false, message: 'API Key không được để trống' }));
        }

        process.env.GROQ_API_KEY = newKey;
        process.env.GROQ_MODEL = newModel;

        const envContent = `# PillMate Groq AI Integration\nGROQ_API_KEY=${newKey}\nGROQ_MODEL=${newModel}\n`;
        fs.writeFileSync(path.join(__dirname, '.env'), envContent, 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ 
          success: true, 
          message: 'Đã lưu Groq API Key thành công!',
          model: newModel 
        }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, message: e.message }));
      }
    });
    return;
  }

  // Endpoint: Chat with Groq Llama 3.3
  if (req.method === 'POST' && pathname === '/api/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        loadEnv();
        const payload = JSON.parse(body || '{}');
        const userMessage = (payload.message || '').trim();
        const clientApiKey = (payload.apiKey || '').trim();
        const apiKey = clientApiKey || process.env.GROQ_API_KEY;
        const targetModel = payload.model || process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';

        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({
            error: 'MISSING_API_KEY',
            message: 'Chưa có Groq API Key. Vui lòng cung cấp key gsk_... để kết nối trực tiếp Groq.'
          }));
        }

        const systemPrompt = `Bạn là Trợ lý Y tế Thông minh PillMate (PillMate AI Assistant) cho dự án Hộp thuốc thông minh IoT & AI.
Sứ mệnh của bạn: Đồng hành cùng người bệnh và người cao tuổi tuân thủ uống thuốc an toàn, đúng giờ và đúng liều.
Các nguyên tắc tư vấn:
1. Xử lý quên liều: Giải thích nguyên tắc nửa thời gian (khoảng cách an toàn). Tuyệt đối cảnh báo không được tự ý uống gấp đôi liều cùng một lúc.
2. Tương tác thuốc & Dinh dưỡng: Phân tích dựa trên dược thư chuẩn (trước/sau bữa ăn, thời gian hấp thu của Paracetamol, kháng sinh, thuốc tiểu đường, thuốc huyết áp).
3. Tính năng hộp thuốc PillMate: Đèn LED chỉ dẫn màu theo từng ngăn thuốc, chuông báo đa âm tần, cảm biến mở nắp hồng ngoại chống mở sai ngăn, khóa thông minh chống uống quá liều, kết nối Wi-Fi & Bluetooth với ứng dụng điện thoại PillMate Family Care (hỗ trợ iOS & Android).
4. Khuyến cáo y tế bắt buộc: Luôn nhấn mạnh câu trả lời mang tính chất tham khảo, không thay thế chẩn đoán hay chỉ định y khoa trực tiếp từ bác sĩ chuyên khoa hoặc dược sĩ điều trị.
5. Phong cách trả lời: Ân cần, ngắn gọn, chuẩn xác y tế, trình bày đẹp mắt bằng các gạch đầu dòng rõ ràng, định dạng HTML cơ bản (<strong>, •, <br>, <em>).`;

        const groqMessages = [
          { role: 'system', content: systemPrompt }
        ];

        // Include recent history if provided
        if (Array.isArray(payload.history)) {
          payload.history.slice(-6).forEach(h => {
            if (h && (h.role === 'user' || h.role === 'assistant') && h.content) {
              groqMessages.push({ role: h.role, content: h.content });
            }
          });
        }

        groqMessages.push({ role: 'user', content: userMessage });

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: targetModel,
            messages: groqMessages,
            temperature: 0.6,
            max_tokens: 1024
          })
        });

        if (!groqRes.ok) {
          const errText = await groqRes.text();
          let parsedErr = errText;
          try { parsedErr = JSON.parse(errText); } catch (e) {}
          res.writeHead(groqRes.status, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ 
            error: 'GROQ_API_ERROR', 
            details: parsedErr.error?.message || errText 
          }));
        }

        const groqData = await groqRes.json();
        const replyContent = groqData.choices?.[0]?.message?.content || 'Xin lỗi, không nhận được nội dung từ Groq.';

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          reply: replyContent,
          model: groqData.model || targetModel,
          provider: 'Groq Cloud'
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'SERVER_ERROR', message: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(__dirname, reqPath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const PORT = 5173;
server.listen(PORT, () => {
  console.log(`PillMate website running at http://localhost:${PORT}`);
});

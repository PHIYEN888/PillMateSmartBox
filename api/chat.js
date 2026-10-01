module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body || {};
    const userMessage = (payload.message || '').trim();
    const clientApiKey = (payload.apiKey || '').trim();
    const apiKey = clientApiKey || process.env.GROQ_API_KEY;
    const targetModel = payload.model || process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';

    if (!apiKey) {
      return res.status(400).json({
        error: 'MISSING_API_KEY',
        message: 'Chưa có Groq API Key. Vui lòng cung cấp key gsk_... để kết nối trực tiếp Groq.'
      });
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
      return res.status(groqRes.status).json({
        error: 'GROQ_API_ERROR',
        details: parsedErr.error?.message || errText
      });
    }

    const groqData = await groqRes.json();
    const replyContent = groqData.choices?.[0]?.message?.content || 'Xin lỗi, không nhận được nội dung từ Groq.';

    return res.status(200).json({
      reply: replyContent,
      model: groqData.model || targetModel,
      provider: 'Groq Cloud'
    });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
};

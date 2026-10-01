module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = req.body || {};
  const newKey = (payload.apiKey || '').trim();
  const newModel = (payload.model || 'qwen/qwen3.8-27b').trim();

  if (!newKey) {
    return res.status(400).json({ success: false, message: 'API Key không được để trống' });
  }

  process.env.GROQ_API_KEY = newKey;
  process.env.GROQ_MODEL = newModel;

  return res.status(200).json({
    success: true,
    message: 'Đã lưu Groq API Key thành công!',
    model: newModel
  });
};

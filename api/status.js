module.exports = (req, res) => {
  const hasKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().startsWith('gsk_'));
  res.status(200).json({
    groqReady: hasKey,
    model: process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
    maskedKey: hasKey ? `${process.env.GROQ_API_KEY.slice(0, 7)}...${process.env.GROQ_API_KEY.slice(-4)}` : null
  });
};

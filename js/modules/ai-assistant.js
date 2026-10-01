/**
 * PillMate - AI Healthcare Assistant (Groq Cloud API with Local Fallback)
 */

export function initAIAssistant() {
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const promptChips = document.querySelectorAll('.prompt-chip');
  const modelBadge = document.getElementById('ai-model-badge');
  const conversationHistory = [];
  let isAiResponding = false;

  if (!chatForm || !chatInput || !chatMessages) return;

  // Check Groq status from backend
  fetch('/api/status')
    .then(r => r.json())
    .then(status => {
      if (modelBadge && status.groqReady) {
        modelBadge.innerHTML = `⚡ Groq • ${status.model ? status.model.split('/')[1] || status.model : 'Active'}`;
        modelBadge.title = `Mô hình Groq Cloud: ${status.model}`;
      }
    })
    .catch(() => {});

  function formatMarkdown(text) {
    if (!text) return '';
    let html = text;
    // bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // bullet points
    html = html.replace(/^\s*[\*\-]\s+(.*)$/gm, '• $1');
    // newlines
    html = html.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    return html;
  }

  function appendMessage(text, sender = 'ai') {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble message-${sender}`;
    if (sender === 'user') {
      bubble.textContent = text;
    } else {
      bubble.innerHTML = text;
    }
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    removeTypingIndicator();
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'chat-typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicators = chatMessages.querySelectorAll('.typing-indicator');
    indicators.forEach(el => el.remove());
  }

  async function handleUserMessage(query) {
    if (!query || !query.trim() || isAiResponding) return;

    const trimmed = query.trim();
    appendMessage(trimmed, 'user');
    conversationHistory.push({ role: 'user', content: trimmed });
    chatInput.value = '';
    isAiResponding = true;
    chatInput.disabled = true;

    showTypingIndicator();

    try {
      // Call Groq API via our backend
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: conversationHistory.slice(-6)
        })
      });

      if (res.ok) {
        const data = await res.json();
        removeTypingIndicator();
        const formatted = formatMarkdown(data.reply);
        appendMessage(formatted, 'ai');
        conversationHistory.push({ role: 'assistant', content: data.reply });
      } else {
        // Fallback to local rule engine
        console.warn('Groq backend error, fallback to local engine');
        removeTypingIndicator();
        const fallback = generateAIResponse(trimmed);
        appendMessage(fallback, 'ai');
        conversationHistory.push({ role: 'assistant', content: fallback });
      }
    } catch (err) {
      console.warn('Network error, fallback to local engine', err);
      removeTypingIndicator();
      const fallback = generateAIResponse(trimmed);
      appendMessage(fallback, 'ai');
      conversationHistory.push({ role: 'assistant', content: fallback });
    } finally {
      isAiResponding = false;
      chatInput.disabled = false;
      chatInput.focus();
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserMessage(chatInput.value);
  });

  promptChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const promptText = chip.getAttribute('data-prompt') || chip.textContent.trim();
      handleUserMessage(promptText);
    });
  });
}

export function generateAIResponse(input) {
  const q = input.toLowerCase();

  // Quên liều
  if (q.includes('quên') || q.includes('bỏ lỡ') || q.includes('trễ')) {
    return `<strong>PillMate AI Hướng dẫn xử lý quên liều:</strong><br>
    1. <strong>Quy tắc khoảng cách thời gian:</strong> Nếu thời điểm bạn nhớ ra còn xa so với liều kế tiếp (> 4 tiếng), bạn có thể uống bổ sung ngay.<br>
    2. <strong>Tuyệt đối không uống gấp đôi liều</strong> cùng một lúc để bù liều đã quên.<br>
    3. Hộp thuốc PillMate tự động gửi cảnh báo trễ liều tới điện thoại người thân để hỗ trợ theo dõi kịp thời.<br><br>
    <small style="color:#d97706;">*Lưu ý y khoa: Nếu đây là thuốc điều trị chuyên khoa (tiểu đường/tim mạch), hãy liên hệ bác sĩ phụ trách để được hướng dẫn cụ thể.</small>`;
  }

  // Đặt lịch / Huyết áp
  if (q.includes('huyết áp') || q.includes('8h') || q.includes('nhắc') || q.includes('đặt lịch') || q.includes('lịch trình')) {
    return `<strong>Đã thiết lập lịch trình thành công!</strong><br>
    ⏰ <strong>Giờ uống:</strong> 08:00 Sáng hàng ngày<br>
    💊 <strong>Ngăn thuốc:</strong> Ngăn số 1 (Đèn LED xanh dương sẽ kích hoạt lúc 07:55)<br>
    📲 <strong>Cảnh báo thông minh:</strong> Chuông âm tần nhẹ nhàng kèm thông báo tới ứng dụng người thân.<br>
    PillMate chúc bạn và gia đình một ngày mới tràn đầy sức sống!`;
  }

  // Tương tác thuốc
  if (q.includes('tương tác') || q.includes('panadol') || q.includes('paracetamol') || q.includes('kháng sinh') || q.includes('uống chung')) {
    return `<strong>Phân tích an toàn tương tác thuốc:</strong><br>
    • <strong>Paracetamol</strong> và hầu hết các nhóm kháng sinh thông thường (như Amoxicillin/Augmentin) không có tương tác đối kháng nghiêm trọng.<br>
    • Nên uống cách nhau 1-2 tiếng để dạ dày hấp thu tốt nhất và uống sau bữa ăn no.<br>
    • Tránh uống nhiều loại thuốc có cùng hoạt chất giảm đau hạ sốt để phòng ngừa quá liều paracetamol (tối đa 2g - 3g/ngày).<br><br>
    <small style="color:#0284c7;">*Thông tin trích xuất từ dược thư chuẩn. Vui lòng tuân thủ đúng chỉ định của bác sĩ kê toa.</small>`;
  }

  // Tiểu đường
  if (q.includes('tiểu đường') || q.includes('đường huyết') || q.includes('sau ăn') || q.includes('trước ăn')) {
    return `<strong>Gợi ý lịch uống thuốc kiểm soát đường huyết:</strong><br>
    • Thuốc nhóm <em>Metformin</em> thường được khuyến cáo dùng ngay trong hoặc ngay sau bữa ăn để giảm kích ứng dạ dày.<br>
    • Các nhóm thuốc kích thích tiết insulin thường uống trước bữa ăn 30 phút theo toa.<br>
    • PillMate có thể hẹn giờ kích hoạt đèn LED trước bữa ăn 15 phút để bạn chuẩn bị sẵn sàng.<br>
    Thông tin đã được ghi nhận vào hồ sơ chăm sóc của bạn!`;
  }

  // Giá cả / Mua hàng / Liên hệ
  if (q.includes('giá') || q.includes('mua') || q.includes('bao nhiêu') || q.includes('chi phí') || q.includes('đặt hàng') || q.includes('bán')) {
    return `<strong>Thông tin sản phẩm & Hợp tác giải pháp PillMate:</strong><br>
    • Website PillMate hiện là cổng thông tin quảng bá giải pháp và trình diễn công nghệ IoT y tế.<br>
    • Để nhận hồ sơ giới thiệu, báo giá dự án hoặc tư vấn triển khai cho gia đình / viện dưỡng lão / phòng khám, bạn hãy bấm vào nút <strong>"Liên hệ tư vấn"</strong> ở góc trên thanh menu.<br>
    • Đội ngũ chuyên viên PillMate sẽ liên hệ tư vấn giải pháp tối ưu nhất cho bạn!`;
  }

  // Tính năng / Hộp thuốc / IoT
  if (q.includes('tính năng') || q.includes('hộp thuốc') || q.includes('iot') || q.includes('led') || q.includes('chuông') || q.includes('công nghệ')) {
    return `<strong>Đặc điểm công nghệ nổi bật của Hộp thuốc PillMate:</strong><br>
    1. <strong>Đèn LED & Chuông đa âm tần:</strong> Chỉ dẫn chính xác ngăn thuốc cần uống theo từng khung giờ.<br>
    2. <strong>Cảm biến hồng ngoại mở nắp:</strong> Xác nhận người bệnh đã uống thuốc hay chưa.<br>
    3. <strong>Khóa thông minh:</strong> Ngăn chặn tình trạng mở nhầm ngăn hoặc uống quá liều.<br>
    4. <strong>Kết nối đám mây 24/7:</strong> Đồng bộ dữ liệu tuân thủ điều trị trực tiếp đến ứng dụng con cái.<br>
    Bạn có thể chuyển sang mục <strong>"Tính năng"</strong> trên thanh menu để xem chi tiết!`;
  }

  // Ứng dụng di động / App
  if (q.includes('app') || q.includes('ứng dụng') || q.includes('kết nối') || q.includes('wifi') || q.includes('điện thoại') || q.includes('cài đặt')) {
    return `<strong>Ứng dụng di động PillMate Family Care:</strong><br>
    • Hỗ trợ cả 2 hệ điều hành <strong>iOS</strong> và <strong>Android</strong>.<br>
    • Kết nối không dây linh hoạt qua <strong>Wi-Fi 2.4GHz & Bluetooth 5.0 BLE</strong>.<br>
    • Tính năng: Nhắc nhở từ xa, quản lý tủ thuốc thông minh, chia sẻ phân quyền cho nhiều người thân trong gia đình.<br>
    • Báo cáo tuân thủ điều trị xuất file PDF định kỳ gửi bác sĩ điều trị.`;
  }

  // Chào hỏi / Giới thiệu
  if (q.includes('chào') || q.includes('hello') || q.includes('hi') || q.includes('bạn là ai') || q.includes('pillmate')) {
    return `Xin chào! Tôi là <strong>Trợ lý Y tế Thông minh PillMate</strong> 💙.<br>
    Tôi được phát triển để đồng hành cùng bạn và gia đình trong việc quản lý dùng thuốc đúng giờ, đúng liều.<br>
    Bạn có thể hỏi tôi về:<br>
    • <em>"Quên liều trưa thì xử lý sao?"</em><br>
    • <em>"Đặt lịch uống thuốc huyết áp lúc 8h sáng"</em><br>
    • <em>"Thuốc tiểu đường uống trước hay sau ăn?"</em><br>
    • <em>"Tính năng nổi bật của hộp thuốc PillMate"</em>`;
  }

  // Default fallback response
  return `Chào bạn, tôi là <strong>Trợ lý Y tế Thông minh PillMate</strong>!<br>
  Tôi đã ghi nhận câu hỏi: "<em>${escapeHTML(input)}</em>".<br>
  Tôi có thể hỗ trợ bạn:<br>
  • Lên lịch nhắc giờ uống thuốc tự động trên hộp PillMate<br>
  • Hướng dẫn cách xử lý an toàn khi quên hoặc trễ liều<br>
  • Kiểm tra lưu ý dinh dưỡng và phân tích tương tác thuốc.<br><br>
  <small style="color:#64748b;">(PillMate đồng hành vì sức khỏe an tâm mỗi ngày)</small>`;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/**
 * PillMate - Người trợ lý chăm sóc sức khỏe tại nhà
 * Core JavaScript Logic & Interactive Modules
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeMode();
  initNavigation();
  initPillBoxSimulator();
  initAIAssistant();
  initFAQAccordion();
  initOrderModal();
  initLiveToasts();
});

/* ==========================================================================
   0. Theme Mode (Light / Dark)
   ========================================================================== */
function initThemeMode() {
  const themeToggles = document.querySelectorAll('.theme-pill-btn, #theme-toggle, #mobile-theme-toggle');
  const storedTheme = localStorage.getItem('pillmate-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme, false);

  function applyTheme(theme, showNotification = true) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pillmate-theme', theme);

    // Update mobile toggle label if present
    const mobileText = document.querySelector('.mobile-theme-text');
    if (mobileText) {
      mobileText.textContent = theme === 'dark' ? '🌙 Chế độ Ban đêm' : '☀️ Chế độ Ban ngày';
    }

    // Update aria labels
    themeToggles.forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối');
      btn.setAttribute('title', theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối');
    });

    if (showNotification) {
      showToast(theme === 'dark' ? '🌙 Đã chuyển sang giao diện Ban đêm' : '☀️ Đã chuyển sang giao diện Ban ngày');
    }
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(targetTheme, true);
    });
  });

  // Follow system theme changes if user hasn't chosen manually
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('pillmate-theme')) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }
}

/* ==========================================================================
   1. Navigation & Page Views (SPA-like switching)
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link, .view-trigger');
  const viewSections = document.querySelectorAll('.view-section');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Sticky navbar shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const viewMap = {
    '': 'view-home',
    '#home': 'view-home',
    '#view-home': 'view-home',
    '#product': 'view-product',
    '#view-product': 'view-product',
    '#features': 'view-features',
    '#view-features': 'view-features',
    '#ai': 'view-ai',
    '#ai-assistant': 'view-ai',
    '#view-ai': 'view-ai',
    '#about': 'view-about',
    '#view-about': 'view-about'
  };

  function resolveViewId(hash) {
    if (!hash) return 'view-home';
    const cleanHash = hash.toLowerCase().trim();
    if (viewMap[cleanHash]) return viewMap[cleanHash];
    const stripped = cleanHash.replace(/^#/, '');
    if (document.getElementById(stripped)) return stripped;
    if (document.getElementById('view-' + stripped)) return 'view-' + stripped;
    return 'view-home';
  }

  // Switch View
  function switchView(targetViewId, updateHash = true) {
    viewSections.forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(targetViewId);
    if (targetSection) {
      targetSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-target') === targetViewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
    }

    if (updateHash) {
      const hashForView = targetViewId === 'view-home' ? '' : '#' + targetViewId.replace('view-', '');
      if (window.location.hash !== hashForView) {
        try {
          history.pushState(null, '', hashForView || window.location.pathname);
        } catch (e) {
          // ignore if history api restricted
        }
      }
    }
  }

  // Expose switchView globally and correctly
  window.switchView = function(viewId) {
    switchView(viewId, true);
  };

  // Link click events (seamless for both SPA and standalone pages)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetView = link.getAttribute('data-target');
      if (targetView) {
        const targetSection = document.getElementById(targetView);
        if (targetSection) {
          e.preventDefault();
          switchView(targetView, true);
        } else {
          const pageMap = {
            'view-home': 'index.html',
            'view-product': 'product.html',
            'view-features': 'features.html',
            'view-ai': 'ai.html',
            'view-about': 'about.html'
          };
          if (pageMap[targetView]) {
            e.preventDefault();
            window.location.href = pageMap[targetView];
          }
        }
      }
    });
  });

  // Handle URL hash on initial load
  const initialView = resolveViewId(window.location.hash);
  if (initialView && initialView !== 'view-home') {
    switchView(initialView, false);
  }

  // Handle Back/Forward browser buttons
  window.addEventListener('popstate', () => {
    const currentView = resolveViewId(window.location.hash);
    switchView(currentView, false);
  });

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   2. Smart Pill Box Interactive Simulation
   ========================================================================== */
const pillBoxData = [
  { day: 'T2', name: 'Thứ Hai', time: '07:30 Sáng', meds: 'Amlodipin 5mg (Huyết áp), Omega 3', status: 'taken', statusText: 'Đã uống lúc 07:32' },
  { day: 'T3', name: 'Thứ Ba', time: '07:30 Sáng', meds: 'Amlodipin 5mg, Canxi nano', status: 'taken', statusText: 'Đã uống lúc 07:28' },
  { day: 'T4', name: 'Thứ Tư', time: '07:30 Sáng', meds: 'Amlodipin 5mg, Vitamin D3', status: 'taken', statusText: 'Đã uống lúc 07:35' },
  { day: 'T5', name: 'Thứ Năm', time: '07:30 Sáng', meds: 'Amlodipin 5mg, Omega 3', status: 'active', statusText: 'Liều hiện tại - Đèn LED đang sáng' },
  { day: 'T6', name: 'Thứ Sáu', time: '07:30 Sáng', meds: 'Amlodipin 5mg, Men tiêu hóa', status: 'upcoming', statusText: 'Chưa đến giờ uống' },
  { day: 'T7', name: 'Thứ Bảy', time: '07:30 Sáng', meds: 'Amlodipin 5mg, Omega 3', status: 'upcoming', statusText: 'Chưa đến giờ uống' },
  { day: 'CN', name: 'Chủ Nhật', time: '08:00 Sáng', meds: 'Amlodipin 5mg, Canxi tổng hợp', status: 'upcoming', statusText: 'Chưa đến giờ uống' },
];

function initPillBoxSimulator() {
  const slots = document.querySelectorAll('.slot-btn');
  const detailTitle = document.getElementById('selected-slot-title');
  const detailTime = document.getElementById('selected-slot-time');
  const detailMeds = document.getElementById('selected-slot-meds');
  const detailStatus = document.getElementById('selected-slot-status');
  const playSoundBtn = document.getElementById('btn-test-sound');

  if (!slots.length) return;

  function updateSlotView(index) {
    const data = pillBoxData[index];
    if (!data) return;

    slots.forEach((s, idx) => {
      s.classList.toggle('selected', idx === index);
    });

    if (detailTitle) detailTitle.textContent = `${data.name} (${data.day})`;
    if (detailTime) detailTime.textContent = `Giờ uống: ${data.time}`;
    if (detailMeds) detailMeds.textContent = `Loại thuốc: ${data.meds}`;
    if (detailStatus) {
      detailStatus.textContent = data.statusText;
      detailStatus.className = 'slot-badge ' + (data.status === 'taken' ? 'badge-success' : (data.status === 'active' ? 'badge-primary' : 'badge-neutral'));
    }
  }

  slots.forEach((slot, idx) => {
    slot.addEventListener('click', () => {
      updateSlotView(idx);
    });
  });

  if (playSoundBtn) {
    playSoundBtn.addEventListener('click', () => {
      // Simulate chime sound with Web Audio API synthesizer
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
        showToast('🔔 Chuông báo PillMate đang phát: "Đã đến giờ uống thuốc buổi sáng của Bác Minh"');
      } catch (e) {
        showToast('🔔 Chuông báo PillMate mô phỏng!');
      }
    });
  }
}

/* ==========================================================================
   3. AI Healthcare Assistant Interactive Chat
   ========================================================================== */
function initAIAssistant() {
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

function generateAIResponse(input) {
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

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('open');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        }
      });
    }
  });
}

/* ==========================================================================
   5. Consultation Modal & Information Request
   ========================================================================== */
function initOrderModal() {
  const orderModal = document.getElementById('order-modal');
  const openButtons = document.querySelectorAll('.open-consult-modal, .open-order-modal');
  const closeButton = document.getElementById('close-modal-btn');
  const orderForm = document.getElementById('order-checkout-form');
  const packageSelect = document.getElementById('modal-package-select');

  if (!orderModal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselectedTier = btn.getAttribute('data-package') || 'pro';
      if (packageSelect) {
        packageSelect.value = preselectedTier;
      }
      orderModal.classList.add('active');
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      orderModal.classList.remove('active');
    });
  }

  // Click outside to close
  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      orderModal.classList.remove('active');
    }
  });

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerName = document.getElementById('order-name').value;
      const phone = document.getElementById('order-phone').value;
      const pkg = packageSelect.options[packageSelect.selectedIndex].text;

      orderModal.classList.remove('active');
      showToast(`🎉 Cảm ơn ${customerName}! Yêu cầu tư vấn giải pháp "${pkg}" đã được tiếp nhận. Chuyên viên PillMate sẽ liên hệ qua SĐT ${phone} trong vòng 15-30 phút.`);
      orderForm.reset();
    });
  }
}

/* ==========================================================================
   6. Live Toast Notifications (Showcase & Brand Highlights)
   ========================================================================== */
function initLiveToasts() {
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.id = 'toast-container';
  document.body.appendChild(toastContainer);

  const sampleNotifications = [
    '🔔 Bác Minh (Đà Nẵng) vừa uống thuốc huyết áp lúc 07:32 đúng giờ',
    '💡 Hơn 5.000 gia đình và 15 cơ sở y tế đã triển khai giải pháp PillMate',
    '✅ Cụ Trần Văn Tuấn (TP.HCM) đã đạt 100% chỉ số tuân thủ điều trị tuần qua',
    '🏥 PillMate vừa hoàn thành đánh giá thử nghiệm lâm sàng tại Bệnh viện Lão Khoa',
    '📱 Ứng dụng PillMate vừa cập nhật tính năng nhận diện toa thuốc bằng AI'
  ];

  let toastIndex = 0;
  setInterval(() => {
    showToast(sampleNotifications[toastIndex % sampleNotifications.length]);
    toastIndex++;
  }, 16000);
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

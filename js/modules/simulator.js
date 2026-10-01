/**
 * PillMate - Smart Pill Box Interactive Simulation & Chime Synthesizer
 */
import { showToast } from './toast.js';

export function initPillBoxSimulator() {
  const slots = document.querySelectorAll('.slot');
  const slotNumberEl = document.getElementById('selected-slot-number');
  const slotStatusText = document.getElementById('slot-status-text');
  const slotMedName = document.getElementById('slot-med-name');
  const slotDosage = document.getElementById('slot-dosage');
  const slotTime = document.getElementById('slot-time');
  const slotNotes = document.getElementById('slot-notes');
  const openSlotBtn = document.getElementById('open-slot-btn');
  const playSoundBtn = document.getElementById('play-sound-btn');

  const slotData = {
    1: { name: 'Amlodipine 5mg', dosage: '1 viên', time: '08:00 Sáng', notes: 'Thuốc hạ huyết áp, uống cùng 1 ly nước ấm sau ăn sáng.', state: 'active' },
    2: { name: 'Metformin 850mg', dosage: '1 viên', time: '12:30 Trưa', notes: 'Kiểm soát đường huyết, uống ngay trong bữa trưa.', state: 'pending' },
    3: { name: 'Omega-3 Dược Dụng', dosage: '2 viên', time: '13:00 Trưa', notes: 'Bổ trợ tim mạch và trí não, uống sau ăn.', state: 'locked' },
    4: { name: 'Rosuvastatin 10mg', dosage: '1 viên', time: '19:00 Tối', notes: 'Thuốc mỡ máu, ổn định mảng xơ vữa động mạch.', state: 'locked' },
    5: { name: 'Ginkgo Biloba 120mg', dosage: '1 viên', time: '20:30 Tối', notes: 'Tăng cường tuần hoàn máu não, hỗ trợ giấc ngủ sâu.', state: 'locked' },
    6: { name: 'Ngăn Dự Phòng Khẩn Cấp', dosage: 'Theo toa', time: 'Khi cần', notes: 'Ngăn chứa thuốc giảm đau hoặc cấp cứu khi có chỉ định khẩn cấp.', state: 'locked' }
  };

  let currentSlot = 1;

  function updateSlotView(slotNum) {
    currentSlot = slotNum;
    const data = slotData[slotNum];
    if (!data) return;

    slots.forEach(s => s.classList.remove('active'));
    const activeSlotEl = document.querySelector(`.slot[data-slot="${slotNum}"]`);
    if (activeSlotEl) activeSlotEl.classList.add('active');

    if (slotNumberEl) slotNumberEl.textContent = slotNum;
    if (slotMedName) slotMedName.textContent = data.name;
    if (slotDosage) slotDosage.textContent = data.dosage;
    if (slotTime) slotTime.textContent = data.time;
    if (slotNotes) slotNotes.textContent = data.notes;

    if (slotStatusText) {
      if (data.state === 'active') {
        slotStatusText.innerHTML = '<span style="color:var(--success); font-weight:700;">● Đã đến giờ uống (Đèn LED xanh đang sáng)</span>';
      } else if (data.state === 'pending') {
        slotStatusText.innerHTML = '<span style="color:var(--warning); font-weight:700;">● Sắp đến giờ (12:30)</span>';
      } else {
        slotStatusText.innerHTML = '<span style="color:var(--text-light); font-weight:600;">🔒 Khóa thông minh (Chưa tới khung giờ)</span>';
      }
    }
  }

  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      const slotNum = parseInt(slot.getAttribute('data-slot'), 10);
      updateSlotView(slotNum);
    });
  });

  if (openSlotBtn) {
    openSlotBtn.addEventListener('click', () => {
      const data = slotData[currentSlot];
      if (data && data.state === 'active') {
        showToast(`✅ Đã mở nắp ngăn số ${currentSlot} thành công! Cảm biến xác nhận lấy thuốc.`);
      } else {
        showToast(`🔒 Ngăn số ${currentSlot} đang khóa an toàn để tránh uống thuốc sai giờ.`);
      }
    });
  }

  if (playSoundBtn) {
    playSoundBtn.addEventListener('click', () => {
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

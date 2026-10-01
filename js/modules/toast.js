/**
 * PillMate - Toast Notification System
 */

export function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

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

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

export function initLiveToasts() {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const sampleNotifications = [
    'Bác Minh (Hà Nội) vừa uống thuốc huyết áp lúc 08:00',
    'Chị Lan (Đà Nẵng) đã xác nhận lịch uống thuốc trưa',
    'Hệ thống PillMate Cloud: Đồng bộ dữ liệu 6 ngăn thuốc thành công',
    'Gia đình Tuấn Thành: Nhận thông báo tuân thủ điều trị của mẹ'
  ];

  let toastIndex = 0;
  setInterval(() => {
    if (Math.random() > 0.45) {
      showToast(sampleNotifications[toastIndex % sampleNotifications.length]);
      toastIndex++;
    }
  }, 32000);
}

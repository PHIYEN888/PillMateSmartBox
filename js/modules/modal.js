/**
 * PillMate - Consultation & Pre-order Modal Module
 */
import { showToast } from './toast.js';

export function initOrderModal() {
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
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    orderModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  // Click outside backdrop to close
  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      closeModal();
    }
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && orderModal.classList.contains('active')) {
      closeModal();
    }
  });

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerName = document.getElementById('order-name')?.value || 'Quý khách';
      const phone = document.getElementById('order-phone')?.value || '';
      const pkg = packageSelect ? packageSelect.options[packageSelect.selectedIndex].text : 'Gói Tiêu chuẩn';

      closeModal();
      showToast(`🎉 Cảm ơn ${customerName}! Yêu cầu tư vấn giải pháp "${pkg}" đã được tiếp nhận. Chuyên viên PillMate sẽ liên hệ qua SĐT ${phone} trong vòng 15-30 phút.`);
      orderForm.reset();
    });
  }
}

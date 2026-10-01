/**
 * PillMate - Modern Sliding Pill Light/Dark Theme Switcher
 */
import { showToast } from './toast.js';

export function initThemeMode() {
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

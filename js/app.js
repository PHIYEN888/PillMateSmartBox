/**
 * PillMate - Người trợ lý chăm sóc sức khỏe tại nhà
 * Core JavaScript Entry Orchestrator (ES Module Architecture)
 */

import { initThemeMode } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initPillBoxSimulator } from './modules/simulator.js';
import { initAIAssistant } from './modules/ai-assistant.js';
import { initFAQAccordion } from './modules/faq.js';
import { initOrderModal } from './modules/modal.js';
import { initLiveToasts } from './modules/toast.js';

function initApp() {
  initThemeMode();
  initNavigation();
  initPillBoxSimulator();
  initAIAssistant();
  initFAQAccordion();
  initOrderModal();
  initLiveToasts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

export {
  initThemeMode,
  initNavigation,
  initPillBoxSimulator,
  initAIAssistant,
  initFAQAccordion,
  initOrderModal,
  initLiveToasts
};

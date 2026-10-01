/**
 * PillMate - Navigation & View Switching (SPA + Standalone Page Routing)
 */

export function initNavigation() {
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link, .view-trigger');
  const viewSections = document.querySelectorAll('.view-section');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Sticky navbar shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
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
          // ignore
        }
      }
    }
  }

  // Expose switchView globally
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

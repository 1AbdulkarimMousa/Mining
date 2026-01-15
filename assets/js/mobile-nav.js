/**
 * Ziyo International - Mobile Navigation
 * Enhanced mobile menu with smooth animations
 * Bright Theme Optimized
 * Version: 3.0
 */

class MobileNavigation {
  constructor(options = {}) {
    this.options = {
      toggleSelector: '.mobile-menu-toggle',
      overlaySelector: '.mobile-menu-overlay',
      navSelector: '.mobile-menu-nav',
      bodyClass: 'menu-open',
      activeClass: 'active',
      breakpoint: 992,
      ...options
    };

    this.toggle = null;
    this.overlay = null;
    this.nav = null;
    this.isOpen = false;
    this.scrollPosition = 0;

    this.init();
  }

  init() {
    // First try custom toggle, then fallback to Bootstrap toggle
    this.toggle = document.querySelector(this.options.toggleSelector) ||
                  document.querySelector('.navbar-toggler-ziyo');
    this.overlay = document.querySelector(this.options.overlaySelector);
    this.nav = document.querySelector(this.options.navSelector);

    // Create mobile menu structure if not exists
    if (!this.overlay) {
      this.createMobileMenu();
    }

    this.setupEventListeners();
  }

  createMobileMenu() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'mobile-menu-overlay';

    // Create content wrapper
    const content = document.createElement('div');
    content.className = 'mobile-menu-content';

    // Clone navigation
    const desktopNav = document.querySelector('.navbar-nav');
    if (desktopNav) {
      const mobileNav = document.createElement('ul');
      mobileNav.className = 'mobile-menu-nav';

      desktopNav.querySelectorAll('.nav-link-ziyo').forEach(link => {
        const li = document.createElement('li');
        const a = link.cloneNode(true);
        a.classList.remove('nav-link-ziyo');
        li.appendChild(a);
        mobileNav.appendChild(li);
      });

      this.nav = mobileNav;
      content.appendChild(mobileNav);
    }

    // Add language toggle
    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
      const langWrapper = document.createElement('div');
      langWrapper.className = 'mobile-lang-toggle mt-4';
      langWrapper.innerHTML = `
        <button class="lang-toggle" data-lang-toggle style="transform: scale(1.2);">
          <i class="fa-solid fa-globe"></i>
          <span class="lang-text">中文</span>
        </button>
      `;
      content.appendChild(langWrapper);
    }

    // Add contact info
    const contactInfo = document.createElement('div');
    contactInfo.className = 'mobile-contact-info mt-5 text-center';
    contactInfo.innerHTML = `
      <p class="text-muted mb-2">Contact Us</p>
      <a href="mailto:waqi.rehman@outlook.com" class="d-block text-secondary mb-1">waqi.rehman@outlook.com</a>
      <a href="tel:+923335566981" class="d-block text-secondary">+92 333 5566 981</a>
    `;
    content.appendChild(contactInfo);

    this.overlay.appendChild(content);
    document.body.appendChild(this.overlay);

    // Use existing Bootstrap toggle if available, do NOT create a duplicate
    if (!this.toggle) {
      this.toggle = document.querySelector('.navbar-toggler-ziyo');
    }

    // Only create toggle if none exists
    if (!this.toggle) {
      const navbar = document.querySelector('.navbar-ziyo .container');
      if (navbar) {
        this.toggle = document.createElement('button');
        this.toggle.className = 'mobile-menu-toggle';
        this.toggle.setAttribute('aria-label', 'Toggle Menu');
        this.toggle.innerHTML = '<span></span><span></span><span></span>';
        navbar.appendChild(this.toggle);
      }
    }
  }

  setupEventListeners() {
    // Toggle button click
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleMenu());
    }

    // Close on nav link click
    if (this.nav) {
      this.nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
    }

    // Close on overlay background click
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.closeMenu();
        }
      });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= this.options.breakpoint && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle swipe to close
    this.setupSwipeGesture();
  }

  setupSwipeGesture() {
    if (!this.overlay) return;

    let startX = 0;
    let startY = 0;

    this.overlay.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    this.overlay.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = Math.abs(endY - startY);

      // Swipe right to close
      if (deltaX > 100 && deltaY < 50) {
        this.closeMenu();
      }
    }, { passive: true });
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.scrollPosition = window.scrollY;

    // Prevent body scroll
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.classList.add(this.options.bodyClass);

    // Animate menu
    this.toggle?.classList.add(this.options.activeClass);
    this.overlay?.classList.add(this.options.activeClass);

    // Focus first link
    setTimeout(() => {
      this.nav?.querySelector('a')?.focus();
    }, 400);

    // Dispatch event
    window.dispatchEvent(new CustomEvent('mobileMenuOpen'));
  }

  closeMenu() {
    this.isOpen = false;

    // Remove animations
    this.toggle?.classList.remove(this.options.activeClass);
    this.overlay?.classList.remove(this.options.activeClass);

    // Restore body scroll
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove(this.options.bodyClass);

    // Restore scroll position
    window.scrollTo(0, this.scrollPosition);

    // Dispatch event
    window.dispatchEvent(new CustomEvent('mobileMenuClose'));
  }
}

// ============================================
// TOUCH SLIDER FOR CARDS
// ============================================
class TouchSlider {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      itemSelector: '.slide-item',
      gap: 16,
      snapToItem: true,
      showIndicators: true,
      ...options
    };

    this.items = [];
    this.currentIndex = 0;
    this.startX = 0;
    this.scrollLeft = 0;
    this.isDown = false;

    this.init();
  }

  init() {
    if (!this.container) return;

    this.items = this.container.querySelectorAll(this.options.itemSelector);
    if (this.items.length === 0) return;

    this.container.style.cssText = `
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;
    `;

    this.items.forEach(item => {
      item.style.scrollSnapAlign = 'start';
      item.style.flexShrink = '0';
    });

    if (this.options.showIndicators) {
      this.createIndicators();
    }

    this.container.addEventListener('scroll', () => this.updateIndicators());
  }

  createIndicators() {
    const indicators = document.createElement('div');
    indicators.className = 'slider-indicators';
    indicators.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
    `;

    this.items.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.style.cssText = `
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--dark-border);
        border: none;
        cursor: pointer;
        transition: background 0.3s, transform 0.3s;
      `;

      if (index === 0) {
        dot.style.background = 'var(--copper-gold)';
        dot.style.transform = 'scale(1.2)';
      }

      dot.addEventListener('click', () => this.goToSlide(index));
      indicators.appendChild(dot);
    });

    this.indicators = indicators;
    this.container.parentNode.appendChild(indicators);
  }

  updateIndicators() {
    if (!this.indicators) return;

    const scrollPosition = this.container.scrollLeft;
    const itemWidth = this.items[0].offsetWidth + this.options.gap;
    const newIndex = Math.round(scrollPosition / itemWidth);

    if (newIndex !== this.currentIndex) {
      this.currentIndex = newIndex;

      this.indicators.querySelectorAll('.slider-dot').forEach((dot, index) => {
        if (index === newIndex) {
          dot.style.background = 'var(--copper-gold)';
          dot.style.transform = 'scale(1.2)';
        } else {
          dot.style.background = 'var(--dark-border)';
          dot.style.transform = 'scale(1)';
        }
      });
    }
  }

  goToSlide(index) {
    const itemWidth = this.items[0].offsetWidth + this.options.gap;
    this.container.scrollTo({
      left: itemWidth * index,
      behavior: 'smooth'
    });
  }
}

// ============================================
// BOTTOM NAVIGATION (App-like)
// ============================================
class BottomNavigation {
  constructor(options = {}) {
    this.options = {
      items: [
        { icon: 'fa-home', label: 'Home', href: 'index.html' },
        { icon: 'fa-folder', label: 'Projects', href: 'projects.html' },
        { icon: 'fa-chart-line', label: 'Invest', href: 'investment.html' },
        { icon: 'fa-envelope', label: 'Contact', href: 'contact.html' }
      ],
      showOnScroll: true,
      ...options
    };

    this.nav = null;
    this.lastScrollY = 0;
    this.isVisible = true;

    if (window.innerWidth < 768) {
      this.init();
    }
  }

  init() {
    this.createNavigation();
    this.setupScrollBehavior();
  }

  createNavigation() {
    this.nav = document.createElement('nav');
    this.nav.className = 'bottom-nav';
    this.nav.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--border-light, #E5E7EB);
      display: flex;
      justify-content: space-around;
      padding: 8px 0;
      padding-bottom: max(8px, env(safe-area-inset-bottom));
      z-index: 1000;
      transform: translateY(0);
      transition: transform 0.3s ease;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    `;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    this.options.items.forEach(item => {
      const link = document.createElement('a');
      link.href = item.href;
      link.className = 'bottom-nav-item';
      const isActive = currentPage === item.href;

      link.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        padding: 8px 16px;
        color: ${isActive ? 'var(--copper-gold, #B87333)' : 'var(--text-secondary, #6B7280)'};
        transition: color 0.3s;
        min-height: 44px;
      `;

      link.innerHTML = `
        <i class="fa-solid ${item.icon}" style="font-size: 20px; margin-bottom: 4px;"></i>
        <span style="font-size: 10px; font-weight: 500;">${item.label}</span>
      `;

      this.nav.appendChild(link);
    });

    document.body.appendChild(this.nav);

    // Add padding to body for bottom nav
    document.body.style.paddingBottom = '70px';
  }

  setupScrollBehavior() {
    if (!this.options.showOnScroll) return;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
        // Scrolling down
        if (this.isVisible) {
          this.nav.style.transform = 'translateY(100%)';
          this.isVisible = false;
        }
      } else {
        // Scrolling up
        if (!this.isVisible) {
          this.nav.style.transform = 'translateY(0)';
          this.isVisible = true;
        }
      }

      this.lastScrollY = currentScrollY;
    }, { passive: true });
  }
}

// ============================================
// INITIALIZE MOBILE COMPONENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize mobile navigation
  window.mobileNav = new MobileNavigation();

  // Initialize touch sliders on mobile
  if (window.innerWidth < 768) {
    document.querySelectorAll('[data-touch-slider]').forEach(slider => {
      new TouchSlider(slider);
    });
  }

  // Optional: Initialize bottom navigation (uncomment to enable)
  // if (window.innerWidth < 768) {
  //   window.bottomNav = new BottomNavigation();
  // }

  console.log('Ziyo International - Mobile navigation initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MobileNavigation,
    TouchSlider,
    BottomNavigation
  };
}

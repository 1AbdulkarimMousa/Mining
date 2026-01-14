/**
 * Ziyo International - Main JavaScript
 * Core functionality and interactions
 * Version: 1.0
 */

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
class Navbar {
  constructor() {
    this.navbar = document.querySelector('.navbar-ziyo');
    this.scrollThreshold = 50;
    this.init();
  }

  init() {
    if (!this.navbar) return;

    window.addEventListener('scroll', () => this.handleScroll());
    this.handleScroll(); // Initial check
  }

  handleScroll() {
    if (window.scrollY > this.scrollThreshold) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          this.scrollTo(targetElement);
        }
      });
    });
  }

  scrollTo(element) {
    const navbarHeight = document.querySelector('.navbar-ziyo')?.offsetHeight || 80;
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
class ScrollAnimations {
  constructor() {
    this.animatedElements = [];
    this.observer = null;
    this.init();
  }

  init() {
    // Select all elements with animation classes
    const selectors = [
      '.fade-up',
      '.fade-in',
      '.scale-in',
      '.slide-left',
      '.slide-right'
    ];

    this.animatedElements = document.querySelectorAll(selectors.join(', '));

    if (this.animatedElements.length === 0) return;

    // Setup Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
      }
    );

    this.animatedElements.forEach(el => {
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally stop observing after animation
        // this.observer.unobserve(entry.target);
      }
    });
  }
}

// ============================================
// COUNTER ANIMATION
// ============================================
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('[data-counter]');
    this.observer = null;
    this.init();
  }

  init() {
    if (this.counters.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      }
    );

    this.counters.forEach(counter => {
      this.observer.observe(counter);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateCounter(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'), 10);
    const duration = parseInt(element.getAttribute('data-duration') || '2000', 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';

    const startTime = performance.now();
    const startValue = 0;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOut);

      element.textContent = prefix + this.formatNumber(currentValue) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = prefix + this.formatNumber(target) + suffix;
      }
    };

    requestAnimationFrame(updateCounter);
  }

  formatNumber(num) {
    return num.toLocaleString();
  }
}

// ============================================
// MOBILE MENU
// ============================================
class MobileMenu {
  constructor() {
    this.toggler = document.querySelector('.navbar-toggler-ziyo');
    this.menu = document.querySelector('.navbar-collapse');
    this.body = document.body;
    this.isOpen = false;
    this.init();
  }

  init() {
    if (!this.toggler || !this.menu) return;

    this.toggler.addEventListener('click', () => this.toggle());

    // Close menu when clicking on a link
    this.menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.toggler.classList.add('active');
    this.menu.classList.add('show');
    this.body.classList.add('menu-open');
  }

  close() {
    this.isOpen = false;
    this.toggler.classList.remove('active');
    this.menu.classList.remove('show');
    this.body.classList.remove('menu-open');
  }
}

// ============================================
// PARALLAX EFFECT
// ============================================
class ParallaxEffect {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    window.addEventListener('scroll', () => this.handleScroll());
    this.handleScroll(); // Initial position
  }

  handleScroll() {
    const scrollY = window.scrollY;

    this.elements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only animate when element is in viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const yPos = -(scrollY * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });
  }
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('[data-src]');
    this.observer = null;
    this.init();
  }

  init() {
    if (this.images.length === 0) return;

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          root: null,
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );

      this.images.forEach(img => {
        this.observer.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadAllImages();
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }

  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }
}

// ============================================
// FORM VALIDATION
// ============================================
class FormValidation {
  constructor() {
    this.forms = document.querySelectorAll('[data-validate]');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));

      // Real-time validation
      form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => this.clearError(field));
      });
    });
  }

  handleSubmit(e, form) {
    let isValid = true;

    form.querySelectorAll('[required]').forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Required check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (type === 'tel' && value) {
      const phoneRegex = /^[\d\s+\-()]{8,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    if (!isValid) {
      this.showError(field, errorMessage);
    } else {
      this.clearError(field);
    }

    return isValid;
  }

  showError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');

    let errorEl = field.parentNode.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'error-message';
      field.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  clearError(field) {
    field.classList.remove('is-invalid');
    if (field.value.trim()) {
      field.classList.add('is-valid');
    }

    const errorEl = field.parentNode.querySelector('.error-message');
    if (errorEl) {
      errorEl.remove();
    }
  }
}

// ============================================
// TAB COMPONENT
// ============================================
class Tabs {
  constructor() {
    this.tabContainers = document.querySelectorAll('[data-tabs]');
    this.init();
  }

  init() {
    this.tabContainers.forEach(container => {
      const tabButtons = container.querySelectorAll('[data-tab-button]');
      const tabPanels = container.querySelectorAll('[data-tab-panel]');

      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          const targetTab = button.getAttribute('data-tab-button');

          // Update buttons
          tabButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          // Update panels
          tabPanels.forEach(panel => {
            if (panel.getAttribute('data-tab-panel') === targetTab) {
              panel.classList.add('active');
            } else {
              panel.classList.remove('active');
            }
          });
        });
      });
    });
  }
}

// ============================================
// ACCORDION COMPONENT
// ============================================
class Accordion {
  constructor() {
    this.accordions = document.querySelectorAll('[data-accordion]');
    this.init();
  }

  init() {
    this.accordions.forEach(accordion => {
      const items = accordion.querySelectorAll('[data-accordion-item]');

      items.forEach(item => {
        const header = item.querySelector('[data-accordion-header]');
        const content = item.querySelector('[data-accordion-content]');

        if (header && content) {
          header.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all items if not allowing multiple
            if (!accordion.hasAttribute('data-allow-multiple')) {
              items.forEach(i => i.classList.remove('open'));
            }

            // Toggle current item
            item.classList.toggle('open', !isOpen);
          });
        }
      });
    });
  }
}

// ============================================
// MODAL COMPONENT
// ============================================
class Modal {
  constructor() {
    this.modals = {};
    this.activeModal = null;
    this.init();
  }

  init() {
    // Setup modal triggers
    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-trigger');
        this.open(modalId);
      });
    });

    // Setup close buttons
    document.querySelectorAll('[data-modal-close]').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => this.close());
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.close();
        }
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });
  }

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.activeModal = modal;
    modal.classList.add('show');
    document.body.classList.add('modal-open');
  }

  close() {
    if (this.activeModal) {
      this.activeModal.classList.remove('show');
      document.body.classList.remove('modal-open');
      this.activeModal = null;
    }
  }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
class BackToTop {
  constructor() {
    this.button = document.querySelector('[data-back-to-top]');
    this.scrollThreshold = 300;
    this.init();
  }

  init() {
    if (!this.button) return;

    window.addEventListener('scroll', () => this.handleScroll());
    this.button.addEventListener('click', () => this.scrollToTop());
  }

  handleScroll() {
    if (window.scrollY > this.scrollThreshold) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Core components
  new Navbar();
  new SmoothScroll();
  new ScrollAnimations();
  new CounterAnimation();
  new MobileMenu();
  new ParallaxEffect();
  new LazyLoader();

  // UI components
  new FormValidation();
  new Tabs();
  new Accordion();
  new Modal();
  new BackToTop();

  // Log initialization
  console.log('Ziyo International - All components initialized');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
const ZiyoUtils = {
  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Format number with commas
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

// Export utilities
window.ZiyoUtils = ZiyoUtils;

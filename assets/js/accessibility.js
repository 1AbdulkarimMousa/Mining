/**
 * Ziyo International - Accessibility Enhancements
 * WCAG 2.1 AA Compliant JavaScript Features
 * Version: 1.0
 */

// ============================================
// KEYBOARD NAVIGATION DETECTION
// ============================================
class KeyboardNavigation {
  constructor() {
    this.isKeyboard = false;
    this.init();
  }

  init() {
    // Detect keyboard vs mouse navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.isKeyboard = true;
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      this.isKeyboard = false;
      document.body.classList.remove('keyboard-nav');
    });
  }
}

// ============================================
// SKIP LINKS
// ============================================
class SkipLinks {
  constructor() {
    this.init();
  }

  init() {
    // Create skip link if not exists
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Add id to main content if not exists
    const main = document.querySelector('main') || document.querySelector('.hero');
    if (main && !main.id) {
      main.id = 'main-content';
    }
  }
}

// ============================================
// FOCUS MANAGEMENT
// ============================================
class FocusManager {
  constructor() {
    this.lastFocusedElement = null;
    this.focusTrapActive = false;
    this.focusTrapElement = null;
  }

  // Save current focus
  saveFocus() {
    this.lastFocusedElement = document.activeElement;
  }

  // Restore saved focus
  restoreFocus() {
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  // Trap focus within an element
  trapFocus(element) {
    if (!element) return;

    this.focusTrapElement = element;
    this.focusTrapActive = true;
    element.setAttribute('data-focus-trap', 'active');

    const focusableElements = this.getFocusableElements(element);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement.focus();

    // Handle tab key
    element.addEventListener('keydown', this.handleTrapKeydown.bind(this));
  }

  // Get all focusable elements
  getFocusableElements(container) {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(container.querySelectorAll(selector))
      .filter(el => el.offsetParent !== null);
  }

  // Handle keydown in focus trap
  handleTrapKeydown(e) {
    if (e.key !== 'Tab') return;

    const focusableElements = this.getFocusableElements(this.focusTrapElement);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  // Release focus trap
  releaseFocusTrap() {
    if (this.focusTrapElement) {
      this.focusTrapElement.removeAttribute('data-focus-trap');
      this.focusTrapElement.removeEventListener('keydown', this.handleTrapKeydown);
      this.focusTrapElement = null;
    }
    this.focusTrapActive = false;
    this.restoreFocus();
  }
}

// ============================================
// LIVE ANNOUNCEMENTS
// ============================================
class LiveAnnouncer {
  constructor() {
    this.politeRegion = null;
    this.assertiveRegion = null;
    this.init();
  }

  init() {
    // Create polite region
    this.politeRegion = this.createRegion('polite');

    // Create assertive region
    this.assertiveRegion = this.createRegion('assertive');
  }

  createRegion(politeness) {
    const region = document.createElement('div');
    region.className = 'sr-announcement';
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', 'status');
    document.body.appendChild(region);
    return region;
  }

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    const region = priority === 'assertive' ? this.assertiveRegion : this.politeRegion;

    // Clear and re-announce
    region.textContent = '';

    // Use setTimeout to ensure announcement is triggered
    setTimeout(() => {
      region.textContent = message;
    }, 100);

    // Clear after announcement
    setTimeout(() => {
      region.textContent = '';
    }, 5000);
  }

  // Shorthand for polite announcement
  polite(message) {
    this.announce(message, 'polite');
  }

  // Shorthand for assertive announcement
  assertive(message) {
    this.announce(message, 'assertive');
  }
}

// ============================================
// REDUCED MOTION DETECTION
// ============================================
class ReducedMotion {
  constructor() {
    this.prefersReducedMotion = false;
    this.init();
  }

  init() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = mediaQuery.matches;

    mediaQuery.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
      this.applyPreference();
    });

    this.applyPreference();
  }

  applyPreference() {
    if (this.prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }

  // Check if animations should be disabled
  shouldReduceMotion() {
    return this.prefersReducedMotion;
  }
}

// ============================================
// EXTERNAL LINK HANDLER
// ============================================
class ExternalLinks {
  constructor() {
    this.init();
  }

  init() {
    // Add attributes to external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      // Add rel for security
      if (!link.rel) {
        link.rel = 'noopener noreferrer';
      }

      // Add screen reader text if not present
      if (!link.querySelector('.sr-only')) {
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = ' (opens in new tab)';
        link.appendChild(srText);
      }
    });
  }
}

// ============================================
// FORM ACCESSIBILITY
// ============================================
class AccessibleForms {
  constructor() {
    this.init();
  }

  init() {
    // Ensure all form inputs have labels
    document.querySelectorAll('input, textarea, select').forEach(input => {
      this.ensureLabel(input);
      this.addAriaDescriptions(input);
    });

    // Add form error handling
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
    });
  }

  ensureLabel(input) {
    const id = input.id || input.name;
    if (!id) return;

    // Check for explicit label
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) return;

    // Check for implicit label (wrapped)
    if (input.closest('label')) return;

    // Check for aria-label
    if (input.getAttribute('aria-label')) return;

    // Check for aria-labelledby
    if (input.getAttribute('aria-labelledby')) return;

    // Log warning for development
    console.warn(`Accessibility: Input "${id}" is missing a label`);
  }

  addAriaDescriptions(input) {
    // Add aria-describedby for helper text
    const helper = input.parentNode.querySelector('.form-helper');
    if (helper && !helper.id) {
      helper.id = `${input.id || input.name}-helper`;
      input.setAttribute('aria-describedby', helper.id);
    }

    // Add aria-required for required fields
    if (input.required && !input.getAttribute('aria-required')) {
      input.setAttribute('aria-required', 'true');
    }
  }

  handleFormSubmit(e, form) {
    const invalidFields = form.querySelectorAll(':invalid');

    if (invalidFields.length > 0) {
      // Announce error count
      if (window.liveAnnouncer) {
        window.liveAnnouncer.assertive(
          `Form has ${invalidFields.length} ${invalidFields.length === 1 ? 'error' : 'errors'}. Please correct and try again.`
        );
      }

      // Focus first invalid field
      invalidFields[0].focus();
    }
  }

  // Show error for a specific field
  showError(field, message) {
    field.classList.add('field-error');
    field.setAttribute('aria-invalid', 'true');

    let errorEl = field.parentNode.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'error-message';
      errorEl.id = `${field.id || field.name}-error`;
      field.parentNode.appendChild(errorEl);
    }

    errorEl.textContent = message;
    field.setAttribute('aria-describedby', errorEl.id);

    // Announce error
    if (window.liveAnnouncer) {
      window.liveAnnouncer.polite(message);
    }
  }

  // Clear error for a specific field
  clearError(field) {
    field.classList.remove('field-error');
    field.removeAttribute('aria-invalid');

    const errorEl = field.parentNode.querySelector('.error-message');
    if (errorEl) {
      errorEl.remove();
    }
  }
}

// ============================================
// TABLE ACCESSIBILITY
// ============================================
class AccessibleTables {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('table').forEach(table => {
      this.enhanceTable(table);
    });
  }

  enhanceTable(table) {
    // Add role if not present
    if (!table.getAttribute('role')) {
      table.setAttribute('role', 'table');
    }

    // Ensure caption or aria-label
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
      console.warn('Accessibility: Table is missing caption or aria-label');
    }

    // Add scope to headers
    table.querySelectorAll('th').forEach(th => {
      if (!th.getAttribute('scope')) {
        // Determine if row or column header
        const isRowHeader = th.closest('tbody');
        th.setAttribute('scope', isRowHeader ? 'row' : 'col');
      }
    });

    // Add responsive wrapper for mobile
    if (!table.parentNode.classList.contains('table-responsive')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive';
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', 'Scrollable table');
      wrapper.setAttribute('tabindex', '0');
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  }
}

// ============================================
// IMAGE ACCESSIBILITY
// ============================================
class AccessibleImages {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('img').forEach(img => {
      this.ensureAlt(img);
    });
  }

  ensureAlt(img) {
    // Check for alt attribute
    if (!img.hasAttribute('alt')) {
      // If decorative, add empty alt
      if (img.classList.contains('decorative') || img.getAttribute('role') === 'presentation') {
        img.alt = '';
      } else {
        console.warn(`Accessibility: Image is missing alt attribute`, img.src);
      }
    }

    // Ensure decorative images are properly marked
    if (img.alt === '' && !img.getAttribute('role')) {
      img.setAttribute('role', 'presentation');
    }
  }
}

// ============================================
// HEADING HIERARCHY
// ============================================
class HeadingHierarchy {
  constructor() {
    this.init();
  }

  init() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    let hasH1 = false;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));

      // Check for h1
      if (level === 1) {
        if (hasH1) {
          console.warn('Accessibility: Multiple h1 elements found');
        }
        hasH1 = true;
      }

      // Check for skipped levels
      if (previousLevel > 0 && level > previousLevel + 1) {
        console.warn(`Accessibility: Heading hierarchy skipped from h${previousLevel} to h${level}`, heading.textContent);
      }

      previousLevel = level;
    });

    if (!hasH1) {
      console.warn('Accessibility: No h1 element found on page');
    }
  }
}

// ============================================
// ARIA LANDMARKS
// ============================================
class AriaLandmarks {
  constructor() {
    this.init();
  }

  init() {
    // Ensure navigation has aria-label
    document.querySelectorAll('nav').forEach((nav, index) => {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', index === 0 ? 'Main navigation' : 'Secondary navigation');
      }
    });

    // Ensure main exists
    if (!document.querySelector('main')) {
      console.warn('Accessibility: No <main> landmark found');
    }

    // Add role to sections if needed
    document.querySelectorAll('section[id]').forEach(section => {
      if (!section.getAttribute('aria-label') && !section.getAttribute('aria-labelledby')) {
        const heading = section.querySelector('h2, h3');
        if (heading && heading.id) {
          section.setAttribute('aria-labelledby', heading.id);
        } else if (heading) {
          heading.id = `section-${section.id}-heading`;
          section.setAttribute('aria-labelledby', heading.id);
        }
      }
    });
  }
}

// ============================================
// TEXT RESIZE SUPPORT
// ============================================
class TextResizeSupport {
  constructor() {
    this.baseFontSize = 16;
    this.currentSize = 16;
    this.init();
  }

  init() {
    // Load saved preference
    const savedSize = localStorage.getItem('ziyo-font-size');
    if (savedSize) {
      this.setFontSize(parseInt(savedSize));
    }
  }

  // Increase font size
  increase() {
    if (this.currentSize < 24) {
      this.setFontSize(this.currentSize + 2);
    }
  }

  // Decrease font size
  decrease() {
    if (this.currentSize > 12) {
      this.setFontSize(this.currentSize - 2);
    }
  }

  // Reset font size
  reset() {
    this.setFontSize(this.baseFontSize);
  }

  // Set font size
  setFontSize(size) {
    this.currentSize = size;
    document.documentElement.style.fontSize = `${size}px`;
    localStorage.setItem('ziyo-font-size', size);

    // Announce change
    if (window.liveAnnouncer) {
      window.liveAnnouncer.polite(`Font size set to ${size} pixels`);
    }
  }
}

// ============================================
// INITIALIZE ACCESSIBILITY FEATURES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all accessibility features
  new KeyboardNavigation();
  new SkipLinks();
  window.focusManager = new FocusManager();
  window.liveAnnouncer = new LiveAnnouncer();
  new ReducedMotion();
  new ExternalLinks();
  new AccessibleForms();
  new AccessibleTables();
  new AccessibleImages();
  new HeadingHierarchy();
  new AriaLandmarks();
  window.textResize = new TextResizeSupport();

  console.log('Ziyo International - Accessibility features initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    KeyboardNavigation,
    FocusManager,
    LiveAnnouncer,
    ReducedMotion,
    ExternalLinks,
    AccessibleForms,
    AccessibleTables,
    AccessibleImages,
    TextResizeSupport
  };
}

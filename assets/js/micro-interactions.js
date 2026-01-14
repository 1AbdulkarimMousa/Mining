/**
 * Ziyo International - Micro-Interactions
 * Advanced UI interactions and polish
 * Version: 2.0
 */

// ============================================
// SMOOTH CURSOR TRAILER
// ============================================
class CursorTrailer {
  constructor(options = {}) {
    this.options = {
      trailLength: 8,
      trailDelay: 40,
      dotSize: 8,
      trailColor: 'rgba(184, 115, 51, 0.5)',
      ...options
    };

    this.dots = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.enabled = window.innerWidth >= 992;

    if (this.enabled && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.init();
    }
  }

  init() {
    // Create trail dots
    for (let i = 0; i < this.options.trailLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail-dot';
      dot.style.cssText = `
        position: fixed;
        width: ${this.options.dotSize - i * 0.5}px;
        height: ${this.options.dotSize - i * 0.5}px;
        background: ${this.options.trailColor};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        opacity: ${1 - i * 0.1};
        transform: translate(-50%, -50%);
        transition: opacity 0.3s;
      `;
      document.body.appendChild(dot);
      this.dots.push({ element: dot, x: 0, y: 0 });
    }

    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    this.animate();
  }

  animate() {
    let x = this.mouseX;
    let y = this.mouseY;

    this.dots.forEach((dot, index) => {
      const nextDot = this.dots[index + 1] || this.dots[0];

      dot.x += (x - dot.x) * (0.3 - index * 0.02);
      dot.y += (y - dot.y) * (0.3 - index * 0.02);

      dot.element.style.left = `${dot.x}px`;
      dot.element.style.top = `${dot.y}px`;

      x = dot.x;
      y = dot.y;
    });

    requestAnimationFrame(() => this.animate());
  }

  hide() {
    this.dots.forEach(dot => {
      dot.element.style.opacity = '0';
    });
  }

  show() {
    this.dots.forEach((dot, i) => {
      dot.element.style.opacity = String(1 - i * 0.1);
    });
  }
}

// ============================================
// MAGNETIC ELEMENTS
// ============================================
class MagneticElements {
  constructor(selector = '.magnetic') {
    this.elements = document.querySelectorAll(selector);
    this.enabled = window.innerWidth >= 992;

    if (this.enabled) {
      this.init();
    }
  }

  init() {
    this.elements.forEach(element => {
      element.addEventListener('mousemove', (e) => this.handleMouseMove(e, element));
      element.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, element));
    });
  }

  handleMouseMove(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const strength = element.dataset.magneticStrength || 0.3;

    element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;

    // Also move inner content slightly
    const inner = element.querySelector('.magnetic-inner');
    if (inner) {
      inner.style.transform = `translate(${x * strength * 0.5}px, ${y * strength * 0.5}px)`;
    }
  }

  handleMouseLeave(e, element) {
    element.style.transform = 'translate(0, 0)';

    const inner = element.querySelector('.magnetic-inner');
    if (inner) {
      inner.style.transform = 'translate(0, 0)';
    }
  }
}

// ============================================
// RIPPLE EFFECT
// ============================================
class RippleEffect {
  constructor(selector = '.ripple') {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.elements.forEach(element => {
      element.addEventListener('click', (e) => this.createRipple(e, element));
    });
  }

  createRipple(e, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleAnimation 0.6s ease-out;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }
}

// Add ripple keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnimation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// ============================================
// TILT CARD EFFECT
// ============================================
class TiltCards {
  constructor(selector = '.tilt-card') {
    this.cards = document.querySelectorAll(selector);
    this.enabled = window.innerWidth >= 992;

    if (this.enabled && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.init();
    }
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => this.handleMove(e, card));
      card.addEventListener('mouseleave', (e) => this.handleLeave(e, card));
    });
  }

  handleMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxTilt = card.dataset.tiltMax || 10;

    const tiltX = ((y - centerY) / centerY) * maxTilt;
    const tiltY = ((centerX - x) / centerX) * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Glare effect
    const glare = card.querySelector('.tilt-glare');
    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, transparent 50%)`;
    }
  }

  handleLeave(e, card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

    const glare = card.querySelector('.tilt-glare');
    if (glare) {
      glare.style.background = 'transparent';
    }
  }
}

// ============================================
// TEXT SCRAMBLE EFFECT
// ============================================
class TextScramble {
  constructor(element) {
    this.element = element;
    this.chars = '!<>-_\\/[]{}—=+*^?#_____';
    this.queue = [];
    this.frame = 0;
    this.frameRequest = null;
    this.resolve = null;
  }

  setText(newText) {
    const oldText = this.element.innerText;
    const length = Math.max(oldText.length, newText.length);

    return new Promise((resolve) => {
      this.resolve = resolve;
      this.queue = [];

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
    });
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.element.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ============================================
// COUNTER ANIMATION
// ============================================
class AnimatedCounter {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      duration: 2000,
      easing: 'easeOutCubic',
      decimals: 0,
      separator: ',',
      ...options
    };

    this.target = parseFloat(element.dataset.count || element.innerText);
    this.prefix = element.dataset.prefix || '';
    this.suffix = element.dataset.suffix || '';
  }

  start() {
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.options.duration, 1);

      const easedProgress = this.ease(progress);
      const currentValue = startValue + (this.target - startValue) * easedProgress;

      this.element.innerText = this.prefix + this.formatNumber(currentValue) + this.suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  ease(t) {
    // Cubic ease out
    return 1 - Math.pow(1 - t, 3);
  }

  formatNumber(num) {
    return num.toFixed(this.options.decimals)
      .replace(/\B(?=(\d{3})+(?!\d))/g, this.options.separator);
  }
}

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================
class ScrollTrigger {
  constructor() {
    this.elements = document.querySelectorAll('[data-scroll-trigger]');
    this.observer = null;
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const animation = element.dataset.scrollTrigger;

            element.classList.add('triggered', animation);

            // Trigger counter if present
            if (element.dataset.count) {
              new AnimatedCounter(element).start();
            }

            // Only trigger once
            if (!element.dataset.scrollRepeat) {
              this.observer.unobserve(element);
            }
          }
        });
      },
      {
        threshold: parseFloat(this.elements[0]?.dataset.scrollThreshold) || 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.elements.forEach(el => this.observer.observe(el));
  }
}

// ============================================
// SMOOTH REVEAL
// ============================================
class SmoothReveal {
  constructor() {
    this.elements = document.querySelectorAll('.smooth-reveal');
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${entry.target.dataset.delay || 0}ms`;
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    this.elements.forEach(el => observer.observe(el));
  }
}

// ============================================
// IMAGE LAZY REVEAL
// ============================================
class ImageLazyReveal {
  constructor() {
    this.images = document.querySelectorAll('.lazy-reveal-image');
    this.init();
  }

  init() {
    if (this.images.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const wrapper = img.closest('.image-reveal-wrapper');

            // Load image
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.onload = () => {
                img.classList.add('loaded');
                if (wrapper) wrapper.classList.add('revealed');
              };
            } else {
              if (wrapper) wrapper.classList.add('revealed');
            }

            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    this.images.forEach(img => observer.observe(img));
  }
}

// ============================================
// FOCUS TRAP FOR MODALS
// ============================================
class FocusTrap {
  constructor(element) {
    this.element = element;
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.firstFocusable = null;
    this.lastFocusable = null;
  }

  activate() {
    const focusables = this.element.querySelectorAll(this.focusableElements);
    this.firstFocusable = focusables[0];
    this.lastFocusable = focusables[focusables.length - 1];

    this.element.addEventListener('keydown', this.handleKeydown.bind(this));
    this.firstFocusable?.focus();
  }

  deactivate() {
    this.element.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleKeydown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault();
        this.lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault();
        this.firstFocusable?.focus();
      }
    }
  }
}

// ============================================
// INITIALIZE MICRO-INTERACTIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all micro-interactions
  new CursorTrailer();
  new MagneticElements('.magnetic, .btn-ziyo');
  new RippleEffect('.ripple, .btn-copper');
  new TiltCards('.tilt-card, .feature-card');
  new ScrollTrigger();
  new SmoothReveal();
  new ImageLazyReveal();

  // Add scramble effect to headings on hover (optional)
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const scramble = new TextScramble(el);
    const originalText = el.innerText;

    el.addEventListener('mouseenter', () => {
      scramble.setText(originalText);
    });
  });

  console.log('Ziyo International - Micro-interactions initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CursorTrailer,
    MagneticElements,
    RippleEffect,
    TiltCards,
    TextScramble,
    AnimatedCounter,
    ScrollTrigger,
    SmoothReveal,
    ImageLazyReveal,
    FocusTrap
  };
}

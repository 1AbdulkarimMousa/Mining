/**
 * Ziyo International - Advanced Animations
 * Sophisticated scroll and interaction animations
 * Version: 1.0
 */

// ============================================
// ENHANCED SCROLL ANIMATIONS
// ============================================
class EnhancedScrollAnimations {
  constructor() {
    this.elements = [];
    this.observer = null;
    this.init();
  }

  init() {
    const selectors = [
      '.reveal-up',
      '.reveal-left',
      '.reveal-right',
      '.reveal-scale',
      '.reveal-rotate',
      '.reveal-blur',
      '.reveal-clip',
      '.fade-up',
      '.fade-in',
      '.scale-in',
      '.slide-left',
      '.slide-right'
    ];

    this.elements = document.querySelectorAll(selectors.join(', '));
    if (this.elements.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      }
    );

    this.elements.forEach(el => this.observer.observe(el));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }
}

// ============================================
// MAGNETIC CURSOR EFFECT
// ============================================
class MagneticCursor {
  constructor() {
    this.elements = document.querySelectorAll('.magnetic-hover, .btn-ziyo');
    this.init();
  }

  init() {
    if (window.innerWidth < 992) return;

    this.elements.forEach(element => {
      element.addEventListener('mousemove', (e) => this.handleMouseMove(e, element));
      element.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, element));
    });
  }

  handleMouseMove(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const strength = 0.15;
    element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }

  handleMouseLeave(e, element) {
    element.style.transform = 'translate(0, 0)';
  }
}

// ============================================
// SMOOTH PARALLAX
// ============================================
class SmoothParallax {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax-speed]');
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.rafId = null;
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY;
    });

    this.animate();
  }

  animate() {
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.1;

    this.elements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.top < viewportHeight && rect.bottom > 0) {
        const yPos = (this.scrollY - element.offsetTop) * speed;
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });

    this.rafId = requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// TILT EFFECT
// ============================================
class TiltEffect {
  constructor() {
    this.elements = document.querySelectorAll('.tilt-effect, .card-3d-lift');
    this.init();
  }

  init() {
    if (window.innerWidth < 992) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.elements.forEach(element => {
      element.addEventListener('mousemove', (e) => this.handleMouseMove(e, element));
      element.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, element));
    });
  }

  handleMouseMove(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  }

  handleMouseLeave(e, element) {
    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
  }
}

// ============================================
// TEXT REVEAL ANIMATION
// ============================================
class TextReveal {
  constructor() {
    this.elements = document.querySelectorAll('.text-reveal');
    this.observer = null;
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    this.elements.forEach(element => {
      this.splitText(element);
    });

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.5 }
    );

    this.elements.forEach(el => this.observer.observe(el));
  }

  splitText(element) {
    const text = element.textContent;
    element.innerHTML = '';
    element.setAttribute('aria-label', text);

    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${index * 0.03}s`;
      element.appendChild(span);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// ============================================
// STAGGER ANIMATION
// ============================================
class StaggerAnimation {
  constructor() {
    this.containers = document.querySelectorAll('[data-stagger]');
    this.observer = null;
    this.init();
  }

  init() {
    if (this.containers.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.2 }
    );

    this.containers.forEach(container => {
      this.observer.observe(container);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.stagger-item');
        const delay = parseInt(entry.target.getAttribute('data-stagger')) || 100;

        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('visible');
          }, index * delay);
        });

        this.observer.unobserve(entry.target);
      }
    });
  }
}

// ============================================
// PROGRESS BAR ANIMATION
// ============================================
class ProgressBarAnimation {
  constructor() {
    this.progressBars = document.querySelectorAll('[data-progress]');
    this.observer = null;
    this.init();
  }

  init() {
    if (this.progressBars.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.5 }
    );

    this.progressBars.forEach(bar => this.observer.observe(bar));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = parseInt(entry.target.getAttribute('data-progress')) || 0;
        const fill = entry.target.querySelector('.progress-fill') || entry.target;

        setTimeout(() => {
          fill.style.width = `${progress}%`;
        }, 100);

        this.observer.unobserve(entry.target);
      }
    });
  }
}

// ============================================
// HOVER SOUND EFFECT (Optional)
// ============================================
class HoverSoundEffect {
  constructor() {
    this.enabled = false;
    this.sound = null;
    this.init();
  }

  init() {
    // Disabled by default - can be enabled via settings
    if (!this.enabled) return;

    this.sound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...');
    this.sound.volume = 0.1;

    document.querySelectorAll('.btn-ziyo, .card-ziyo').forEach(element => {
      element.addEventListener('mouseenter', () => this.playSound());
    });
  }

  playSound() {
    if (this.sound) {
      this.sound.currentTime = 0;
      this.sound.play().catch(() => {});
    }
  }
}

// ============================================
// SMOOTH SCROLL PROGRESS
// ============================================
class ScrollProgress {
  constructor() {
    this.progressBar = document.querySelector('.scroll-progress-bar');
    this.init();
  }

  init() {
    if (!this.progressBar) return;

    window.addEventListener('scroll', () => this.updateProgress());
    this.updateProgress();
  }

  updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    this.progressBar.style.width = `${progress}%`;
  }
}

// ============================================
// CURSOR FOLLOWER
// ============================================
class CursorFollower {
  constructor() {
    this.cursor = null;
    this.cursorInner = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.init();
  }

  init() {
    if (window.innerWidth < 992) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.createCursor();
    this.addEventListeners();
    this.animate();
  }

  createCursor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    this.cursor.innerHTML = '<div class="cursor-inner"></div>';
    document.body.appendChild(this.cursor);

    const style = document.createElement('style');
    style.textContent = `
      .custom-cursor {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid var(--copper-gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
      }
      .cursor-inner {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        background: var(--copper-gold);
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
      .custom-cursor.active {
        transform: scale(1.5);
      }
      .custom-cursor.visible {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  addEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.cursor.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
      this.cursor.classList.remove('visible');
    });

    document.querySelectorAll('a, button, .btn-ziyo').forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.cursor.classList.add('active');
      });
      element.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('active');
      });
    });
  }

  animate() {
    this.cursorX += (this.mouseX - this.cursorX) * 0.15;
    this.cursorY += (this.mouseY - this.cursorY) * 0.15;

    this.cursor.style.left = `${this.cursorX - 20}px`;
    this.cursor.style.top = `${this.cursorY - 20}px`;

    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// IMAGE REVEAL ON SCROLL
// ============================================
class ImageReveal {
  constructor() {
    this.images = document.querySelectorAll('.image-reveal');
    this.observer = null;
    this.init();
  }

  init() {
    if (this.images.length === 0) return;

    this.images.forEach(img => {
      img.style.clipPath = 'inset(0 100% 0 0)';
      img.style.transition = 'clip-path 1s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.3 }
    );

    this.images.forEach(img => this.observer.observe(img));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.clipPath = 'inset(0 0 0 0)';
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// ============================================
// COUNTER WITH EASING
// ============================================
class EnhancedCounter {
  constructor() {
    this.counters = document.querySelectorAll('[data-count]');
    this.observer = null;
    this.init();
  }

  init() {
    if (this.counters.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.5 }
    );

    this.counters.forEach(counter => this.observer.observe(counter));
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
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = parseInt(element.getAttribute('data-duration') || '2000', 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const decimals = parseInt(element.getAttribute('data-decimals') || '0', 10);

    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = easeOut * target;

      const formattedValue = decimals > 0
        ? currentValue.toFixed(decimals)
        : Math.floor(currentValue).toLocaleString();

      element.textContent = prefix + formattedValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        const finalValue = decimals > 0
          ? target.toFixed(decimals)
          : target.toLocaleString();
        element.textContent = prefix + finalValue + suffix;
      }
    };

    requestAnimationFrame(updateCounter);
  }
}

// ============================================
// INITIALIZE ALL ANIMATIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Core animations
  new EnhancedScrollAnimations();
  new EnhancedCounter();
  new StaggerAnimation();
  new ProgressBarAnimation();
  new ImageReveal();

  // Desktop-only effects
  if (window.innerWidth >= 992) {
    new MagneticCursor();
    new TiltEffect();
    new CursorFollower();
  }

  // Optional features
  new SmoothParallax();
  new TextReveal();
  new ScrollProgress();

  console.log('Ziyo International - Advanced animations initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EnhancedScrollAnimations,
    MagneticCursor,
    SmoothParallax,
    TiltEffect,
    TextReveal,
    StaggerAnimation,
    ProgressBarAnimation,
    CursorFollower,
    ImageReveal,
    EnhancedCounter
  };
}

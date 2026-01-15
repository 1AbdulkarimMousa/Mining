/**
 * Ziyo International - UI Components
 * FAQ Accordion, Lightbox, Scroll Progress, Social Proof
 * Version: 1.0
 */

// ============================================
// FAQ ACCORDION
// ============================================
class FAQAccordion {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    this.options = {
      allowMultiple: options.allowMultiple || false,
      animated: options.animated !== false,
      iconOpen: options.iconOpen || 'fa-minus',
      iconClosed: options.iconClosed || 'fa-plus',
      ...options
    };
    this.items = [];
  }

  setData(items) {
    this.items = items;
    this.render();
    this.init();
    return this;
  }

  render() {
    if (!this.container || !this.items.length) return;

    let html = `
      <div class="faq-accordion">
        ${this.items.map((item, i) => `
          <div class="faq-item" data-index="${i}">
            <button class="faq-header" aria-expanded="false" aria-controls="faq-content-${i}">
              <span class="faq-question">${item.question}</span>
              <span class="faq-icon">
                <i class="fa-solid ${this.options.iconClosed}"></i>
              </span>
            </button>
            <div class="faq-content" id="faq-content-${i}" role="region" hidden>
              <div class="faq-answer">${item.answer}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.container.innerHTML = html;
  }

  init() {
    this.container.querySelectorAll('.faq-header').forEach(header => {
      header.addEventListener('click', () => this.toggle(header));
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('faq-header')) {
          e.preventDefault();
          this.toggle(e.target);
        }
      }
    });
  }

  toggle(header) {
    const item = header.closest('.faq-item');
    const content = item.querySelector('.faq-content');
    const icon = header.querySelector('.faq-icon i');
    const isOpen = header.getAttribute('aria-expanded') === 'true';

    if (!this.options.allowMultiple && !isOpen) {
      this.closeAll();
    }

    header.setAttribute('aria-expanded', !isOpen);
    content.hidden = isOpen;
    item.classList.toggle('active', !isOpen);

    icon.classList.toggle(this.options.iconClosed, isOpen);
    icon.classList.toggle(this.options.iconOpen, !isOpen);

    if (!isOpen && this.options.animated) {
      content.style.maxHeight = '0';
      content.hidden = false;
      requestAnimationFrame(() => {
        content.style.maxHeight = content.scrollHeight + 'px';
      });
    } else if (isOpen && this.options.animated) {
      content.style.maxHeight = '0';
      setTimeout(() => { content.hidden = true; }, 300);
    }
  }

  closeAll() {
    this.container.querySelectorAll('.faq-item.active').forEach(item => {
      const header = item.querySelector('.faq-header');
      const content = item.querySelector('.faq-content');
      const icon = header.querySelector('.faq-icon i');

      header.setAttribute('aria-expanded', 'false');
      item.classList.remove('active');
      icon.classList.remove(this.options.iconOpen);
      icon.classList.add(this.options.iconClosed);

      if (this.options.animated) {
        content.style.maxHeight = '0';
        setTimeout(() => { content.hidden = true; }, 300);
      } else {
        content.hidden = true;
      }
    });
  }

  openAll() {
    this.container.querySelectorAll('.faq-item:not(.active)').forEach(item => {
      const header = item.querySelector('.faq-header');
      this.toggle(header);
    });
  }
}

// ============================================
// IMAGE LIGHTBOX
// ============================================
class Lightbox {
  constructor(options = {}) {
    this.options = {
      selector: options.selector || '[data-lightbox]',
      showCaption: options.showCaption !== false,
      showCounter: options.showCounter !== false,
      closeOnBackdrop: options.closeOnBackdrop !== false,
      enableZoom: options.enableZoom || false,
      ...options
    };
    this.images = [];
    this.currentIndex = 0;
    this.lightbox = null;
    this.isZoomed = false;

    this.init();
  }

  init() {
    this.collectImages();
    this.createLightbox();
    this.bindEvents();
  }

  collectImages() {
    document.querySelectorAll(this.options.selector).forEach((el, i) => {
      this.images.push({
        src: el.dataset.lightbox || el.src || el.href,
        caption: el.dataset.caption || el.alt || '',
        thumb: el.src || el.querySelector('img')?.src
      });

      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(i);
      });

      el.style.cursor = 'zoom-in';
    });
  }

  createLightbox() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox-overlay';
    this.lightbox.innerHTML = `
      <div class="lightbox-container">
        <button class="lightbox-close" aria-label="Close lightbox">
          <i class="fa-solid fa-times"></i>
        </button>

        <button class="lightbox-nav lightbox-prev" aria-label="Previous image">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <div class="lightbox-content">
          <img class="lightbox-image" src="" alt="">
          ${this.options.enableZoom ? `
            <button class="lightbox-zoom" aria-label="Toggle zoom">
              <i class="fa-solid fa-magnifying-glass-plus"></i>
            </button>
          ` : ''}
        </div>

        <button class="lightbox-nav lightbox-next" aria-label="Next image">
          <i class="fa-solid fa-chevron-right"></i>
        </button>

        ${this.options.showCaption ? '<div class="lightbox-caption"></div>' : ''}
        ${this.options.showCounter ? '<div class="lightbox-counter"></div>' : ''}
      </div>
    `;

    document.body.appendChild(this.lightbox);
  }

  bindEvents() {
    this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
    this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.next());

    if (this.options.closeOnBackdrop) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) this.close();
      });
    }

    if (this.options.enableZoom) {
      this.lightbox.querySelector('.lightbox-zoom').addEventListener('click', () => this.toggleZoom());
    }

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Touch swipe
    let startX = 0;
    this.lightbox.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.lightbox.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }

  open(index) {
    this.currentIndex = index;
    this.show();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
    this.isZoomed = false;
    this.updateZoomButton();
  }

  show() {
    const item = this.images[this.currentIndex];
    const img = this.lightbox.querySelector('.lightbox-image');
    const caption = this.lightbox.querySelector('.lightbox-caption');
    const counter = this.lightbox.querySelector('.lightbox-counter');

    img.classList.add('loading');
    img.src = item.src;
    img.onload = () => img.classList.remove('loading');

    if (caption) caption.textContent = item.caption;
    if (counter) counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

    // Hide nav if single image
    this.lightbox.querySelector('.lightbox-prev').style.display = this.images.length > 1 ? '' : 'none';
    this.lightbox.querySelector('.lightbox-next').style.display = this.images.length > 1 ? '' : 'none';
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.show();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.show();
  }

  toggleZoom() {
    this.isZoomed = !this.isZoomed;
    const img = this.lightbox.querySelector('.lightbox-image');
    img.classList.toggle('zoomed', this.isZoomed);
    this.updateZoomButton();
  }

  updateZoomButton() {
    const btn = this.lightbox.querySelector('.lightbox-zoom i');
    if (btn) {
      btn.className = this.isZoomed
        ? 'fa-solid fa-magnifying-glass-minus'
        : 'fa-solid fa-magnifying-glass-plus';
    }
  }
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
class ScrollProgress {
  constructor(options = {}) {
    this.options = {
      position: options.position || 'top', // 'top', 'bottom', 'left', 'right'
      color: options.color || '#B87333',
      height: options.height || 4,
      showPercentage: options.showPercentage || false,
      ...options
    };

    this.bar = null;
    this.percentage = null;
    this.init();
  }

  init() {
    this.createElements();
    this.bindScroll();
    this.update();
  }

  createElements() {
    this.bar = document.createElement('div');
    this.bar.className = `scroll-progress scroll-progress-${this.options.position}`;
    this.bar.innerHTML = `<div class="scroll-progress-bar"></div>`;

    if (this.options.showPercentage) {
      this.percentage = document.createElement('div');
      this.percentage.className = 'scroll-progress-percentage';
      this.percentage.textContent = '0%';
      document.body.appendChild(this.percentage);
    }

    document.body.appendChild(this.bar);
  }

  bindScroll() {
    window.addEventListener('scroll', () => this.update(), { passive: true });
    window.addEventListener('resize', () => this.update(), { passive: true });
  }

  update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    const progressBar = this.bar.querySelector('.scroll-progress-bar');

    if (this.options.position === 'left' || this.options.position === 'right') {
      progressBar.style.height = `${progress}%`;
    } else {
      progressBar.style.width = `${progress}%`;
    }

    if (this.percentage) {
      this.percentage.textContent = `${Math.round(progress)}%`;
    }
  }
}

// ============================================
// SOCIAL PROOF NOTIFICATIONS
// ============================================
class SocialProof {
  constructor(options = {}) {
    this.options = {
      notifications: options.notifications || [],
      interval: options.interval || 8000,
      duration: options.duration || 5000,
      position: options.position || 'bottom-left',
      maxVisible: options.maxVisible || 1,
      ...options
    };

    this.currentIndex = 0;
    this.isRunning = false;
    this.container = null;

    this.init();
  }

  init() {
    if (!this.options.notifications.length) return;

    this.createContainer();
    this.start();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = `social-proof-container social-proof-${this.options.position}`;
    document.body.appendChild(this.container);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Show first notification after delay
    setTimeout(() => {
      this.showNext();
    }, 3000);
  }

  stop() {
    this.isRunning = false;
  }

  showNext() {
    if (!this.isRunning) return;

    const notification = this.options.notifications[this.currentIndex];
    this.show(notification);

    this.currentIndex = (this.currentIndex + 1) % this.options.notifications.length;

    setTimeout(() => this.showNext(), this.options.interval);
  }

  show(data) {
    const notification = document.createElement('div');
    notification.className = 'social-proof-notification';
    notification.innerHTML = `
      ${data.image ? `<img src="${data.image}" alt="" class="social-proof-image">` : `
        <div class="social-proof-icon">
          <i class="fa-solid ${data.icon || 'fa-check-circle'}"></i>
        </div>
      `}
      <div class="social-proof-content">
        <p class="social-proof-title">${data.title}</p>
        <p class="social-proof-message">${data.message}</p>
        ${data.time ? `<p class="social-proof-time">${data.time}</p>` : ''}
      </div>
      <button class="social-proof-close" aria-label="Dismiss">
        <i class="fa-solid fa-times"></i>
      </button>
    `;

    // Close button
    notification.querySelector('.social-proof-close').addEventListener('click', () => {
      this.hide(notification);
    });

    // Auto hide
    setTimeout(() => this.hide(notification), this.options.duration);

    // Add to container
    this.container.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('visible');
    });

    // Remove old notifications if exceeding max
    while (this.container.children.length > this.options.maxVisible) {
      this.hide(this.container.firstChild);
    }
  }

  hide(notification) {
    notification.classList.remove('visible');
    setTimeout(() => notification.remove(), 300);
  }

  addNotification(data) {
    this.options.notifications.push(data);
  }
}

// ============================================
// NEWSLETTER POPUP
// ============================================
class NewsletterPopup {
  constructor(options = {}) {
    this.options = {
      delay: options.delay || 15000,
      exitIntent: options.exitIntent !== false,
      scrollTrigger: options.scrollTrigger || 50,
      cookieName: options.cookieName || 'ziyo_newsletter_shown',
      cookieExpiry: options.cookieExpiry || 7,
      ...options
    };

    this.popup = null;
    this.hasShown = false;

    this.init();
  }

  init() {
    // Check if already shown
    if (this.getCookie()) return;

    this.createPopup();
    this.bindTriggers();
  }

  createPopup() {
    this.popup = document.createElement('div');
    this.popup.className = 'newsletter-popup-overlay';
    this.popup.innerHTML = `
      <div class="newsletter-popup">
        <button class="newsletter-close" aria-label="Close">
          <i class="fa-solid fa-times"></i>
        </button>

        <div class="newsletter-content">
          <div class="newsletter-icon">
            <i class="fa-solid fa-envelope"></i>
          </div>
          <h3 class="newsletter-title">Stay Updated</h3>
          <p class="newsletter-message">
            Subscribe to receive the latest news about investment opportunities, project updates, and industry insights.
          </p>

          <form class="newsletter-form" id="newsletter-form">
            <input type="email" name="email" placeholder="Enter your email" required>
            <button type="submit" class="newsletter-submit">
              Subscribe <i class="fa-solid fa-arrow-right"></i>
            </button>
          </form>

          <p class="newsletter-privacy">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(this.popup);

    // Bind events
    this.popup.querySelector('.newsletter-close').addEventListener('click', () => this.close());
    this.popup.addEventListener('click', (e) => {
      if (e.target === this.popup) this.close();
    });

    this.popup.querySelector('#newsletter-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit(e.target);
    });
  }

  bindTriggers() {
    // Delay trigger
    if (this.options.delay) {
      setTimeout(() => this.show(), this.options.delay);
    }

    // Exit intent trigger
    if (this.options.exitIntent) {
      document.addEventListener('mouseout', (e) => {
        if (e.clientY < 10 && !this.hasShown) {
          this.show();
        }
      });
    }

    // Scroll trigger
    if (this.options.scrollTrigger) {
      window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent >= this.options.scrollTrigger && !this.hasShown) {
          this.show();
        }
      }, { passive: true });
    }
  }

  show() {
    if (this.hasShown || this.getCookie()) return;

    this.hasShown = true;
    this.popup.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.popup.classList.remove('visible');
    document.body.style.overflow = '';
    this.setCookie();
  }

  submit(form) {
    const email = form.email.value;
    const submitBtn = form.querySelector('.newsletter-submit');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';

    // Simulate API call
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
      submitBtn.classList.add('success');

      // Dispatch event
      document.dispatchEvent(new CustomEvent('newsletterSubscribed', {
        detail: { email }
      }));

      setTimeout(() => this.close(), 2000);
    }, 1500);
  }

  setCookie() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + this.options.cookieExpiry);
    document.cookie = `${this.options.cookieName}=true;expires=${expiry.toUTCString()};path=/`;
  }

  getCookie() {
    return document.cookie.includes(this.options.cookieName);
  }
}

// ============================================
// PAGE TRANSITIONS
// ============================================
class PageTransitions {
  constructor(options = {}) {
    this.options = {
      duration: options.duration || 500,
      effect: options.effect || 'fade', // 'fade', 'slide', 'zoom'
      selector: options.selector || 'a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])',
      ...options
    };

    this.overlay = null;
    this.init();
  }

  init() {
    this.createOverlay();
    this.bindLinks();
    this.handlePageLoad();
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = `page-transition-overlay transition-${this.options.effect}`;
    this.overlay.innerHTML = `
      <div class="transition-loader">
        <span class="brand-icon">Z</span>
      </div>
    `;
    document.body.appendChild(this.overlay);
  }

  bindLinks() {
    document.querySelectorAll(this.options.selector).forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Skip if same page or external
        if (!href || href === window.location.pathname) return;
        if (href.startsWith('http') && !href.includes(window.location.hostname)) return;

        e.preventDefault();
        this.navigate(href);
      });
    });
  }

  navigate(url) {
    this.overlay.classList.add('active');

    setTimeout(() => {
      window.location.href = url;
    }, this.options.duration);
  }

  handlePageLoad() {
    // Show page with transition
    window.addEventListener('load', () => {
      document.body.classList.add('page-loaded');
      this.overlay.classList.remove('active');
    });

    // Handle back/forward navigation
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        this.overlay.classList.remove('active');
      }
    });
  }
}

// ============================================
// STYLES FOR UI COMPONENTS
// ============================================
const uiStyles = document.createElement('style');
uiStyles.textContent = `
  /* FAQ Accordion */
  .faq-accordion {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .faq-item {
    background: var(--dark-card, #1A1A1A);
    border: 1px solid var(--dark-border, #2A2A2A);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .faq-item.active {
    border-color: var(--copper-gold, #B87333);
  }

  .faq-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 25px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    color: var(--text-primary, #F5F5F5);
    transition: all 0.3s ease;
  }

  .faq-header:hover {
    background: rgba(184, 115, 51, 0.05);
  }

  .faq-question {
    font-size: 16px;
    font-weight: 600;
    flex: 1;
    padding-right: 20px;
  }

  .faq-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--dark-tertiary, #222);
    border-radius: 50%;
    color: var(--copper-gold, #B87333);
    transition: all 0.3s ease;
  }

  .faq-item.active .faq-icon {
    background: var(--copper-gold, #B87333);
    color: var(--dark-primary, #0A0A0A);
  }

  .faq-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .faq-answer {
    padding: 0 25px 20px;
    color: var(--text-secondary, #A0A0A0);
    font-size: 15px;
    line-height: 1.7;
  }

  /* Lightbox */
  .lightbox-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.95);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .lightbox-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .lightbox-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .lightbox-content {
    max-width: 90vw;
    max-height: 90vh;
    position: relative;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .lightbox-image.loading {
    opacity: 0.5;
  }

  .lightbox-image.zoomed {
    cursor: zoom-out;
    transform: scale(1.5);
  }

  .lightbox-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
  }

  .lightbox-close:hover {
    background: var(--copper-gold, #B87333);
  }

  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .lightbox-nav:hover {
    background: var(--copper-gold, #B87333);
  }

  .lightbox-prev { left: 20px; }
  .lightbox-next { right: 20px; }

  .lightbox-caption {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    max-width: 80%;
    text-align: center;
  }

  .lightbox-counter {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.7);
    padding: 8px 16px;
    border-radius: 20px;
    color: white;
    font-size: 14px;
  }

  .lightbox-zoom {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .lightbox-zoom:hover {
    background: var(--copper-gold, #B87333);
  }

  /* Scroll Progress */
  .scroll-progress {
    position: fixed;
    z-index: 9999;
    pointer-events: none;
  }

  .scroll-progress-top {
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
  }

  .scroll-progress-bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
  }

  .scroll-progress-left {
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;
  }

  .scroll-progress-right {
    top: 0;
    right: 0;
    bottom: 0;
    width: 4px;
  }

  .scroll-progress-bar {
    background: var(--copper-gradient, linear-gradient(90deg, #B87333, #CD853F));
    height: 100%;
    width: 0;
    transition: width 0.1s ease;
  }

  .scroll-progress-left .scroll-progress-bar,
  .scroll-progress-right .scroll-progress-bar {
    width: 100%;
    height: 0;
    transition: height 0.1s ease;
  }

  .scroll-progress-percentage {
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: var(--dark-card, #1A1A1A);
    color: var(--copper-gold, #B87333);
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid var(--dark-border, #2A2A2A);
  }

  /* Social Proof */
  .social-proof-container {
    position: fixed;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }

  .social-proof-bottom-left { bottom: 20px; left: 20px; }
  .social-proof-bottom-right { bottom: 20px; right: 20px; }
  .social-proof-top-left { top: 80px; left: 20px; }
  .social-proof-top-right { top: 80px; right: 20px; }

  .social-proof-notification {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--dark-card, #1A1A1A);
    border: 1px solid var(--dark-border, #2A2A2A);
    border-radius: 12px;
    padding: 15px;
    max-width: 320px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transform: translateX(-120%);
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: auto;
  }

  .social-proof-bottom-right .social-proof-notification,
  .social-proof-top-right .social-proof-notification {
    transform: translateX(120%);
  }

  .social-proof-notification.visible {
    transform: translateX(0);
    opacity: 1;
  }

  .social-proof-image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .social-proof-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--copper-gradient, linear-gradient(135deg, #B87333, #CD853F));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dark-primary, #0A0A0A);
    font-size: 20px;
  }

  .social-proof-content {
    flex: 1;
    min-width: 0;
  }

  .social-proof-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary, #F5F5F5);
    margin: 0 0 4px;
  }

  .social-proof-message {
    font-size: 13px;
    color: var(--text-secondary, #A0A0A0);
    margin: 0;
  }

  .social-proof-time {
    font-size: 11px;
    color: var(--copper-gold, #B87333);
    margin: 4px 0 0;
  }

  .social-proof-close {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--dark-tertiary, #222);
    border: none;
    color: var(--text-secondary, #A0A0A0);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .social-proof-notification:hover .social-proof-close {
    opacity: 1;
  }

  /* Newsletter Popup */
  .newsletter-popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .newsletter-popup-overlay.visible {
    opacity: 1;
    visibility: visible;
  }

  .newsletter-popup {
    background: var(--dark-card, #1A1A1A);
    border: 1px solid var(--dark-border, #2A2A2A);
    border-radius: 20px;
    max-width: 450px;
    width: 100%;
    position: relative;
    transform: scale(0.9) translateY(20px);
    transition: transform 0.3s ease;
    overflow: hidden;
  }

  .newsletter-popup-overlay.visible .newsletter-popup {
    transform: scale(1) translateY(0);
  }

  .newsletter-close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--dark-tertiary, #222);
    border: none;
    color: var(--text-secondary, #A0A0A0);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 1;
  }

  .newsletter-close:hover {
    background: var(--dark-border, #2A2A2A);
    color: var(--text-primary, #F5F5F5);
  }

  .newsletter-content {
    padding: 50px 40px 40px;
    text-align: center;
  }

  .newsletter-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--copper-gradient, linear-gradient(135deg, #B87333, #CD853F));
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 25px;
    font-size: 32px;
    color: var(--dark-primary, #0A0A0A);
  }

  .newsletter-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary, #F5F5F5);
    margin: 0 0 12px;
  }

  .newsletter-message {
    font-size: 15px;
    color: var(--text-secondary, #A0A0A0);
    margin: 0 0 25px;
    line-height: 1.6;
  }

  .newsletter-form {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .newsletter-form input {
    flex: 1;
    min-width: 200px;
    padding: 14px 18px;
    background: var(--dark-tertiary, #222);
    border: 1px solid var(--dark-border, #2A2A2A);
    border-radius: 10px;
    color: var(--text-primary, #F5F5F5);
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s ease;
  }

  .newsletter-form input:focus {
    border-color: var(--copper-gold, #B87333);
  }

  .newsletter-submit {
    padding: 14px 24px;
    background: var(--copper-gradient, linear-gradient(135deg, #B87333, #CD853F));
    border: none;
    border-radius: 10px;
    color: var(--dark-primary, #0A0A0A);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
  }

  .newsletter-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(184, 115, 51, 0.3);
  }

  .newsletter-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .newsletter-submit.success {
    background: #50C878;
  }

  .newsletter-privacy {
    font-size: 12px;
    color: var(--text-muted, #666);
    margin: 20px 0 0;
  }

  /* Page Transitions */
  .page-transition-overlay {
    position: fixed;
    inset: 0;
    background: var(--dark-primary, #0A0A0A);
    z-index: 10002;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.5s ease;
  }

  .page-transition-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .transition-loader {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .transition-loader .brand-icon {
    width: 60px;
    height: 60px;
    background: var(--copper-gradient, linear-gradient(135deg, #B87333, #CD853F));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 800;
    color: var(--dark-primary, #0A0A0A);
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .faq-header {
      padding: 15px 20px;
    }

    .faq-question {
      font-size: 14px;
    }

    .faq-answer {
      padding: 0 20px 15px;
      font-size: 14px;
    }

    .social-proof-notification {
      max-width: 280px;
    }

    .newsletter-content {
      padding: 40px 25px 30px;
    }
  }
`;
document.head.appendChild(uiStyles);

// ============================================
// EXPORTS
// ============================================
window.ZiyoUI = {
  FAQAccordion,
  Lightbox,
  ScrollProgress,
  SocialProof,
  NewsletterPopup,
  PageTransitions
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FAQAccordion, Lightbox, ScrollProgress, SocialProof, NewsletterPopup, PageTransitions };
}

console.log('Ziyo UI Components - Advanced UI features loaded');

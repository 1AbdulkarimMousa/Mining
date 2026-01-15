/**
 * Ziyo International - Carousel & Slider Components
 * Testimonials, Partners, and Image carousels
 * Version: 1.0
 */

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================
class TestimonialsCarousel {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    this.options = {
      autoplay: options.autoplay !== false,
      interval: options.interval || 5000,
      pauseOnHover: options.pauseOnHover !== false,
      showDots: options.showDots !== false,
      showArrows: options.showArrows !== false,
      transition: options.transition || 500,
      ...options
    };
    this.testimonials = [];
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.isPaused = false;
  }

  setData(testimonials) {
    this.testimonials = testimonials;
    this.render();
    this.init();
    return this;
  }

  render() {
    if (!this.container || !this.testimonials.length) return;

    let html = `
      <div class="testimonials-carousel">
        <div class="testimonials-track-wrapper">
          <div class="testimonials-track">
            ${this.testimonials.map((t, i) => `
              <div class="testimonial-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
                <div class="testimonial-card">
                  <div class="testimonial-quote">
                    <i class="fa-solid fa-quote-left"></i>
                  </div>
                  <p class="testimonial-text">${t.text}</p>
                  <div class="testimonial-author">
                    ${t.avatar ? `<img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar">` : `
                      <div class="testimonial-avatar-placeholder">${t.name.charAt(0)}</div>
                    `}
                    <div class="testimonial-info">
                      <h5 class="testimonial-name">${t.name}</h5>
                      <p class="testimonial-role">${t.role}</p>
                      ${t.company ? `<p class="testimonial-company">${t.company}</p>` : ''}
                    </div>
                  </div>
                  ${t.rating ? `
                    <div class="testimonial-rating">
                      ${this.renderStars(t.rating)}
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${this.options.showArrows ? `
          <button class="carousel-arrow carousel-prev" aria-label="Previous testimonial">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button class="carousel-arrow carousel-next" aria-label="Next testimonial">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        ` : ''}

        ${this.options.showDots ? `
          <div class="carousel-dots">
            ${this.testimonials.map((_, i) => `
              <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    this.container.innerHTML = html;
  }

  renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        html += '<i class="fa-solid fa-star"></i>';
      } else if (i - 0.5 <= rating) {
        html += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        html += '<i class="fa-regular fa-star"></i>';
      }
    }
    return html;
  }

  init() {
    this.bindEvents();
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  bindEvents() {
    // Arrow buttons
    const prevBtn = this.container.querySelector('.carousel-prev');
    const nextBtn = this.container.querySelector('.carousel-next');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    // Dot buttons
    this.container.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        this.goTo(parseInt(dot.dataset.index));
      });
    });

    // Pause on hover
    if (this.options.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pause());
      this.container.addEventListener('mouseleave', () => this.resume());
    }

    // Touch/swipe support
    this.bindTouchEvents();

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  bindTouchEvents() {
    let startX = 0;
    let endX = 0;

    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }, { passive: true });
  }

  goTo(index) {
    if (index < 0) index = this.testimonials.length - 1;
    if (index >= this.testimonials.length) index = 0;

    const slides = this.container.querySelectorAll('.testimonial-slide');
    const dots = this.container.querySelectorAll('.carousel-dot');

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    this.currentIndex = index;
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      if (!this.isPaused) {
        this.next();
      }
    }, this.options.interval);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }
}

// ============================================
// PARTNERS LOGO CAROUSEL
// ============================================
class PartnersCarousel {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    this.options = {
      speed: options.speed || 30,
      direction: options.direction || 'left',
      pauseOnHover: options.pauseOnHover !== false,
      gap: options.gap || 60,
      ...options
    };
    this.partners = [];
    this.animationId = null;
  }

  setData(partners) {
    this.partners = partners;
    this.render();
    this.init();
    return this;
  }

  render() {
    if (!this.container || !this.partners.length) return;

    // Duplicate partners for seamless loop
    const allPartners = [...this.partners, ...this.partners];

    let html = `
      <div class="partners-carousel">
        <div class="partners-track">
          ${allPartners.map(p => `
            <div class="partner-item">
              ${p.logo ? `
                <img src="${p.logo}" alt="${p.name}" class="partner-logo">
              ` : `
                <div class="partner-placeholder">${p.name}</div>
              `}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  init() {
    const track = this.container.querySelector('.partners-track');
    if (!track) return;

    let position = 0;
    const speed = this.options.direction === 'left' ? -this.options.speed : this.options.speed;

    const animate = () => {
      if (!this.isPaused) {
        position += speed / 60;

        const totalWidth = track.scrollWidth / 2;
        if (Math.abs(position) >= totalWidth) {
          position = 0;
        }

        track.style.transform = `translateX(${position}px)`;
      }
      this.animationId = requestAnimationFrame(animate);
    };

    animate();

    // Pause on hover
    if (this.options.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.isPaused = true);
      this.container.addEventListener('mouseleave', () => this.isPaused = false);
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// ============================================
// IMAGE SLIDER
// ============================================
class ImageSlider {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    this.options = {
      autoplay: options.autoplay || false,
      interval: options.interval || 4000,
      effect: options.effect || 'slide', // 'slide', 'fade', 'zoom'
      showThumbnails: options.showThumbnails || false,
      showCaption: options.showCaption !== false,
      showCounter: options.showCounter !== false,
      ...options
    };
    this.images = [];
    this.currentIndex = 0;
    this.autoplayInterval = null;
  }

  setData(images) {
    this.images = images;
    this.render();
    this.init();
    return this;
  }

  render() {
    if (!this.container || !this.images.length) return;

    let html = `
      <div class="image-slider effect-${this.options.effect}">
        <div class="slider-main">
          <div class="slider-track">
            ${this.images.map((img, i) => `
              <div class="slider-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
                <img src="${img.src}" alt="${img.alt || ''}" loading="lazy">
                ${this.options.showCaption && img.caption ? `
                  <div class="slider-caption">
                    ${img.title ? `<h4>${img.title}</h4>` : ''}
                    <p>${img.caption}</p>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <button class="slider-arrow slider-prev" aria-label="Previous image">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button class="slider-arrow slider-next" aria-label="Next image">
            <i class="fa-solid fa-chevron-right"></i>
          </button>

          ${this.options.showCounter ? `
            <div class="slider-counter">
              <span class="current">1</span> / <span class="total">${this.images.length}</span>
            </div>
          ` : ''}
        </div>

        ${this.options.showThumbnails ? `
          <div class="slider-thumbnails">
            ${this.images.map((img, i) => `
              <button class="slider-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                <img src="${img.thumb || img.src}" alt="${img.alt || ''}">
              </button>
            `).join('')}
          </div>
        ` : ''}

        <div class="slider-dots">
          ${this.images.map((_, i) => `
            <button class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>
          `).join('')}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  init() {
    this.bindEvents();
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  bindEvents() {
    const prevBtn = this.container.querySelector('.slider-prev');
    const nextBtn = this.container.querySelector('.slider-next');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    // Dots
    this.container.querySelectorAll('.slider-dot').forEach(dot => {
      dot.addEventListener('click', () => this.goTo(parseInt(dot.dataset.index)));
    });

    // Thumbnails
    this.container.querySelectorAll('.slider-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => this.goTo(parseInt(thumb.dataset.index)));
    });

    // Touch support
    this.bindTouchEvents();

    // Keyboard
    this.container.setAttribute('tabindex', '0');
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Pause autoplay on interaction
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => {
      if (this.options.autoplay) this.startAutoplay();
    });
  }

  bindTouchEvents() {
    let startX = 0;

    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }

  goTo(index) {
    if (index < 0) index = this.images.length - 1;
    if (index >= this.images.length) index = 0;

    const slides = this.container.querySelectorAll('.slider-slide');
    const dots = this.container.querySelectorAll('.slider-dot');
    const thumbs = this.container.querySelectorAll('.slider-thumb');

    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === index));

    // Update counter
    const counter = this.container.querySelector('.slider-counter .current');
    if (counter) counter.textContent = index + 1;

    this.currentIndex = index;
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), this.options.interval);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// ============================================
// CAROUSEL STYLES
// ============================================
const carouselStyles = document.createElement('style');
carouselStyles.textContent = `
  /* Testimonials Carousel */
  .testimonials-carousel {
    position: relative;
    overflow: hidden;
    padding: 20px 0;
  }

  .testimonials-track-wrapper {
    overflow: hidden;
  }

  .testimonials-track {
    display: flex;
    transition: transform 0.5s ease;
  }

  .testimonial-slide {
    min-width: 100%;
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.5s ease;
    padding: 0 20px;
    box-sizing: border-box;
    display: none;
  }

  .testimonial-slide.active {
    opacity: 1;
    transform: scale(1);
    display: block;
  }

  .testimonial-card {
    background: var(--dark-card, #1A1A1A);
    border: 1px solid var(--dark-border, #2A2A2A);
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
  }

  .testimonial-quote {
    color: var(--copper-gold, #B87333);
    font-size: 32px;
    margin-bottom: 20px;
    opacity: 0.6;
  }

  .testimonial-text {
    font-size: 18px;
    line-height: 1.8;
    color: var(--text-secondary, #A0A0A0);
    margin-bottom: 30px;
    font-style: italic;
  }

  .testimonial-author {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  .testimonial-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--copper-gold, #B87333);
  }

  .testimonial-avatar-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--copper-gradient, linear-gradient(135deg, #B87333, #CD853F));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    color: var(--dark-primary, #0A0A0A);
  }

  .testimonial-info {
    text-align: left;
  }

  .testimonial-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary, #F5F5F5);
    margin: 0 0 4px;
  }

  .testimonial-role {
    font-size: 13px;
    color: var(--text-secondary, #A0A0A0);
    margin: 0;
  }

  .testimonial-company {
    font-size: 12px;
    color: var(--copper-gold, #B87333);
    margin: 4px 0 0;
  }

  .testimonial-rating {
    margin-top: 20px;
    color: var(--copper-gold, #B87333);
    font-size: 16px;
    display: flex;
    justify-content: center;
    gap: 4px;
  }

  /* Carousel Navigation */
  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--dark-card, #1A1A1A);
    border: 1px solid var(--dark-border, #2A2A2A);
    color: var(--text-primary, #F5F5F5);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .carousel-arrow:hover {
    background: var(--copper-gold, #B87333);
    color: var(--dark-primary, #0A0A0A);
    border-color: var(--copper-gold, #B87333);
  }

  .carousel-prev { left: 10px; }
  .carousel-next { right: 10px; }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 30px;
  }

  .carousel-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--dark-border, #2A2A2A);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .carousel-dot.active,
  .carousel-dot:hover {
    background: var(--copper-gold, #B87333);
    transform: scale(1.2);
  }

  /* Partners Carousel */
  .partners-carousel {
    overflow: hidden;
    padding: 20px 0;
    mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
  }

  .partners-track {
    display: flex;
    gap: 60px;
    will-change: transform;
  }

  .partner-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 150px;
  }

  .partner-logo {
    max-height: 50px;
    max-width: 150px;
    object-fit: contain;
    filter: grayscale(100%) brightness(0.7);
    opacity: 0.6;
    transition: all 0.3s ease;
  }

  .partner-item:hover .partner-logo {
    filter: grayscale(0%) brightness(1);
    opacity: 1;
  }

  .partner-placeholder {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary, #A0A0A0);
    padding: 15px 30px;
    background: var(--dark-card, #1A1A1A);
    border-radius: 8px;
    border: 1px solid var(--dark-border, #2A2A2A);
    white-space: nowrap;
  }

  /* Image Slider */
  .image-slider {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    background: var(--dark-card, #1A1A1A);
  }

  .slider-main {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
  }

  .slider-track {
    width: 100%;
    height: 100%;
  }

  .slider-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .slider-slide.active {
    opacity: 1;
    z-index: 1;
  }

  .effect-slide .slider-slide {
    transform: translateX(100%);
  }

  .effect-slide .slider-slide.active {
    transform: translateX(0);
  }

  .effect-zoom .slider-slide {
    transform: scale(1.1);
  }

  .effect-zoom .slider-slide.active {
    transform: scale(1);
  }

  .slider-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .slider-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    color: var(--text-primary, #F5F5F5);
  }

  .slider-caption h4 {
    font-size: 20px;
    margin: 0 0 8px;
  }

  .slider-caption p {
    font-size: 14px;
    margin: 0;
    opacity: 0.8;
  }

  .slider-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .slider-arrow:hover {
    background: var(--copper-gold, #B87333);
  }

  .slider-prev { left: 15px; }
  .slider-next { right: 15px; }

  .slider-counter {
    position: absolute;
    bottom: 15px;
    right: 15px;
    background: rgba(0, 0, 0, 0.6);
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 14px;
    color: white;
    z-index: 10;
  }

  .slider-thumbnails {
    display: flex;
    gap: 10px;
    padding: 15px;
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .slider-thumb {
    flex-shrink: 0;
    width: 80px;
    height: 60px;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    background: none;
    transition: all 0.3s ease;
  }

  .slider-thumb.active,
  .slider-thumb:hover {
    border-color: var(--copper-gold, #B87333);
  }

  .slider-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .slider-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 15px;
  }

  .slider-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--dark-border, #2A2A2A);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .slider-dot.active,
  .slider-dot:hover {
    background: var(--copper-gold, #B87333);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .testimonial-card {
      padding: 25px;
    }

    .testimonial-text {
      font-size: 15px;
    }

    .carousel-arrow {
      width: 40px;
      height: 40px;
    }

    .slider-arrow {
      width: 36px;
      height: 36px;
    }
  }
`;
document.head.appendChild(carouselStyles);

// ============================================
// EXPORT
// ============================================
window.ZiyoCarousel = {
  TestimonialsCarousel,
  PartnersCarousel,
  ImageSlider
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TestimonialsCarousel, PartnersCarousel, ImageSlider };
}

console.log('Ziyo Carousel - Slider components loaded');

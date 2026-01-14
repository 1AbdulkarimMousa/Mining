/**
 * Ziyo International - Performance Optimizations
 * Lazy loading, preloading, and performance monitoring
 * Version: 1.0
 */

// ============================================
// LAZY LOADING IMAGES
// ============================================
class LazyImageLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px 0px',
      threshold: 0.01,
      loadedClass: 'loaded',
      errorClass: 'error',
      ...options
    };
    this.observer = null;
    this.init();
  }

  init() {
    const images = document.querySelectorAll('img[data-src], [data-background]');
    if (images.length === 0) return;

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          rootMargin: this.options.rootMargin,
          threshold: this.options.threshold
        }
      );

      images.forEach(img => this.observer.observe(img));
    } else {
      // Fallback for older browsers
      this.loadAllImages(images);
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

  loadImage(element) {
    const src = element.dataset.src;
    const background = element.dataset.background;

    if (src) {
      element.src = src;
      element.removeAttribute('data-src');

      element.onload = () => {
        element.classList.add(this.options.loadedClass);
      };

      element.onerror = () => {
        element.classList.add(this.options.errorClass);
      };
    }

    if (background) {
      element.style.backgroundImage = `url(${background})`;
      element.removeAttribute('data-background');
      element.classList.add(this.options.loadedClass);
    }
  }

  loadAllImages(images) {
    images.forEach(img => this.loadImage(img));
  }
}

// ============================================
// PRELOAD CRITICAL RESOURCES
// ============================================
class ResourcePreloader {
  constructor() {
    this.preloadedUrls = new Set();
  }

  preloadFont(url, crossOrigin = 'anonymous') {
    if (this.preloadedUrls.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = url;
    link.crossOrigin = crossOrigin;
    document.head.appendChild(link);
    this.preloadedUrls.add(url);
  }

  preloadImage(url) {
    if (this.preloadedUrls.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
    this.preloadedUrls.add(url);
  }

  preloadPage(url) {
    if (this.preloadedUrls.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
    this.preloadedUrls.add(url);
  }

  preconnect(url) {
    if (this.preloadedUrls.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
    this.preloadedUrls.add(url);
  }
}

// ============================================
// LINK PREFETCHING ON HOVER
// ============================================
class LinkPrefetcher {
  constructor(options = {}) {
    this.options = {
      delay: 65, // ms to wait before prefetching
      ignoreKeywords: ['logout', 'signout', 'delete'],
      ...options
    };
    this.preloader = new ResourcePreloader();
    this.hoverTimer = null;
    this.init();
  }

  init() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');

      // Only prefetch internal links
      if (!this.shouldPrefetch(href)) return;

      link.addEventListener('mouseenter', () => this.handleHover(href));
      link.addEventListener('mouseleave', () => this.handleLeave());
      link.addEventListener('touchstart', () => this.handleHover(href), { passive: true });
    });
  }

  shouldPrefetch(href) {
    if (!href) return false;
    if (href.startsWith('#')) return false;
    if (href.startsWith('mailto:')) return false;
    if (href.startsWith('tel:')) return false;
    if (href.startsWith('javascript:')) return false;

    // Check for ignored keywords
    const lowerHref = href.toLowerCase();
    if (this.options.ignoreKeywords.some(kw => lowerHref.includes(kw))) return false;

    // Only prefetch same-origin URLs
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return href.startsWith('/') || href.endsWith('.html');
    }
  }

  handleHover(href) {
    this.hoverTimer = setTimeout(() => {
      this.preloader.preloadPage(href);
    }, this.options.delay);
  }

  handleLeave() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    // Wait for page load
    if (document.readyState === 'complete') {
      this.collectMetrics();
    } else {
      window.addEventListener('load', () => {
        // Delay to ensure all metrics are available
        setTimeout(() => this.collectMetrics(), 0);
      });
    }
  }

  collectMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];

    if (navigation) {
      this.metrics = {
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnect: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseStart - navigation.requestStart,
        contentDownload: navigation.responseEnd - navigation.responseStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        domComplete: navigation.domComplete - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        ttfb: navigation.responseStart - navigation.fetchStart
      };
    }

    // Collect paint timings
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      if (entry.name === 'first-paint') {
        this.metrics.firstPaint = entry.startTime;
      }
      if (entry.name === 'first-contentful-paint') {
        this.metrics.firstContentfulPaint = entry.startTime;
      }
    });

    // Log metrics in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.logMetrics();
    }
  }

  logMetrics() {
    console.group('Performance Metrics');
    console.log('DNS Lookup:', this.metrics.dnsLookup?.toFixed(2), 'ms');
    console.log('TCP Connect:', this.metrics.tcpConnect?.toFixed(2), 'ms');
    console.log('Server Response:', this.metrics.serverResponse?.toFixed(2), 'ms');
    console.log('Content Download:', this.metrics.contentDownload?.toFixed(2), 'ms');
    console.log('DOM Interactive:', this.metrics.domInteractive?.toFixed(2), 'ms');
    console.log('DOM Complete:', this.metrics.domComplete?.toFixed(2), 'ms');
    console.log('Load Complete:', this.metrics.loadComplete?.toFixed(2), 'ms');
    console.log('Time to First Byte:', this.metrics.ttfb?.toFixed(2), 'ms');
    console.log('First Paint:', this.metrics.firstPaint?.toFixed(2), 'ms');
    console.log('First Contentful Paint:', this.metrics.firstContentfulPaint?.toFixed(2), 'ms');
    console.groupEnd();
  }

  getMetrics() {
    return this.metrics;
  }
}

// ============================================
// SCROLL PERFORMANCE OPTIMIZATION
// ============================================
class ScrollOptimizer {
  constructor() {
    this.ticking = false;
    this.lastKnownScrollY = 0;
    this.callbacks = [];
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
  }

  handleScroll() {
    this.lastKnownScrollY = window.scrollY;

    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.executeCallbacks();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  executeCallbacks() {
    this.callbacks.forEach(callback => {
      callback(this.lastKnownScrollY);
    });
  }

  onScroll(callback) {
    this.callbacks.push(callback);
  }

  offScroll(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }
}

// ============================================
// DEBOUNCE AND THROTTLE UTILITIES
// ============================================
const PerformanceUtils = {
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  requestIdleCallback(callback, options = {}) {
    if ('requestIdleCallback' in window) {
      return window.requestIdleCallback(callback, options);
    }
    return setTimeout(callback, options.timeout || 1);
  }
};

// ============================================
// CRITICAL CSS INLINER (for development reference)
// ============================================
class CriticalCSSHelper {
  static async extractCriticalCSS() {
    const stylesheets = Array.from(document.styleSheets);
    const criticalRules = [];
    const viewportHeight = window.innerHeight;

    for (const stylesheet of stylesheets) {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        for (const rule of rules) {
          if (rule.type === CSSRule.STYLE_RULE) {
            const elements = document.querySelectorAll(rule.selectorText);
            for (const element of elements) {
              const rect = element.getBoundingClientRect();
              if (rect.top < viewportHeight) {
                criticalRules.push(rule.cssText);
                break;
              }
            }
          }
        }
      } catch (e) {
        // Cross-origin stylesheet
      }
    }

    return criticalRules.join('\n');
  }
}

// ============================================
// INITIALIZE PERFORMANCE OPTIMIZATIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize lazy loading
  new LazyImageLoader();

  // Initialize link prefetching
  new LinkPrefetcher();

  // Initialize performance monitoring
  window.perfMonitor = new PerformanceMonitor();

  // Initialize scroll optimizer
  window.scrollOptimizer = new ScrollOptimizer();

  // Preconnect to external resources
  const preloader = new ResourcePreloader();
  preloader.preconnect('https://fonts.googleapis.com');
  preloader.preconnect('https://fonts.gstatic.com');
  preloader.preconnect('https://cdn.jsdelivr.net');
  preloader.preconnect('https://cdnjs.cloudflare.com');

  console.log('Ziyo International - Performance optimizations initialized');
});

// Export utilities
window.PerformanceUtils = PerformanceUtils;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LazyImageLoader,
    ResourcePreloader,
    LinkPrefetcher,
    PerformanceMonitor,
    ScrollOptimizer,
    PerformanceUtils,
    CriticalCSSHelper
  };
}

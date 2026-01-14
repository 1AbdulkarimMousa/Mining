/**
 * Ziyo International - Performance Optimization
 * Final optimizations for speed and efficiency
 * Version: 1.0
 */

// ============================================
// LAZY LOADING IMAGES
// ============================================
class LazyLoader {
  constructor() {
    this.images = [];
    this.observer = null;
    this.init();
  }

  init() {
    // Find all lazy images
    this.images = document.querySelectorAll('img[data-src], [data-background]');

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );

      this.images.forEach(img => this.observer.observe(img));
    } else {
      // Fallback for older browsers
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

  loadImage(element) {
    if (element.dataset.src) {
      element.src = element.dataset.src;
      element.removeAttribute('data-src');
    }

    if (element.dataset.background) {
      element.style.backgroundImage = `url(${element.dataset.background})`;
      element.removeAttribute('data-background');
    }

    element.classList.add('loaded');
  }

  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }
}

// ============================================
// RESOURCE HINTS
// ============================================
class ResourceHints {
  constructor() {
    this.init();
  }

  init() {
    // Preload critical resources
    this.preloadCriticalAssets();

    // Prefetch likely next pages
    this.prefetchNextPages();
  }

  preloadCriticalAssets() {
    const criticalAssets = [
      { href: 'assets/css/main.css', as: 'style' },
      { href: 'assets/js/main.js', as: 'script' }
    ];

    criticalAssets.forEach(asset => {
      if (!document.querySelector(`link[href="${asset.href}"][rel="preload"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = asset.href;
        link.as = asset.as;
        document.head.appendChild(link);
      }
    });
  }

  prefetchNextPages() {
    // Get all internal links
    const links = document.querySelectorAll('a[href^="/"]:not([href*="#"]), a[href$=".html"]:not([href*="#"])');
    const prefetched = new Set();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const href = entry.target.getAttribute('href');
          if (href && !prefetched.has(href)) {
            this.prefetchPage(href);
            prefetched.add(href);
          }
        }
      });
    }, { rootMargin: '100px' });

    links.forEach(link => observer.observe(link));
  }

  prefetchPage(href) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
}

// ============================================
// DEFERRED LOADING
// ============================================
class DeferredLoader {
  constructor() {
    this.init();
  }

  init() {
    // Load non-critical scripts after page load
    if (document.readyState === 'complete') {
      this.loadDeferredResources();
    } else {
      window.addEventListener('load', () => this.loadDeferredResources());
    }
  }

  loadDeferredResources() {
    // Load analytics or other non-critical scripts
    const deferredScripts = document.querySelectorAll('script[data-defer-src]');
    deferredScripts.forEach(script => {
      const newScript = document.createElement('script');
      newScript.src = script.dataset.deferSrc;
      if (script.dataset.async) newScript.async = true;
      document.body.appendChild(newScript);
    });
  }
}

// ============================================
// CRITICAL CSS INLINING HELPER
// ============================================
class CriticalCSS {
  constructor() {
    this.init();
  }

  init() {
    // Load non-critical CSS asynchronously
    const stylesheets = document.querySelectorAll('link[data-async-css]');

    stylesheets.forEach(link => {
      link.media = 'print';
      link.onload = function() {
        this.media = 'all';
      };
    });
  }
}

// ============================================
// PERFORMANCE METRICS
// ============================================
class PerformanceMetrics {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    if ('performance' in window) {
      // Wait for page to be fully loaded
      window.addEventListener('load', () => {
        setTimeout(() => this.collectMetrics(), 0);
      });
    }
  }

  collectMetrics() {
    const timing = performance.timing;
    const navigation = performance.getEntriesByType('navigation')[0];

    this.metrics = {
      // Page load time
      pageLoadTime: timing.loadEventEnd - timing.navigationStart,

      // DOM Content Loaded
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,

      // First Paint (if available)
      firstPaint: this.getFirstPaint(),

      // Time to First Byte
      ttfb: timing.responseStart - timing.navigationStart,

      // DOM Interactive
      domInteractive: timing.domInteractive - timing.navigationStart,

      // Resource count
      resourceCount: performance.getEntriesByType('resource').length
    };

    // Log metrics in development
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log('Performance Metrics:', this.metrics);
    }

    // Send to analytics if needed
    this.reportMetrics();
  }

  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  reportMetrics() {
    // Could send to analytics service
    // For now, just dispatch a custom event
    window.dispatchEvent(new CustomEvent('performanceMetrics', {
      detail: this.metrics
    }));
  }

  getMetrics() {
    return this.metrics;
  }
}

// ============================================
// NETWORK QUALITY DETECTION
// ============================================
class NetworkQuality {
  constructor() {
    this.connection = null;
    this.quality = 'good';
    this.init();
  }

  init() {
    if ('connection' in navigator) {
      this.connection = navigator.connection;
      this.detectQuality();

      this.connection.addEventListener('change', () => {
        this.detectQuality();
        this.applyOptimizations();
      });
    }
  }

  detectQuality() {
    if (!this.connection) {
      this.quality = 'good';
      return;
    }

    const effectiveType = this.connection.effectiveType;
    const downlink = this.connection.downlink;
    const saveData = this.connection.saveData;

    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      this.quality = 'poor';
    } else if (effectiveType === '3g' || downlink < 1.5) {
      this.quality = 'moderate';
    } else {
      this.quality = 'good';
    }

    document.documentElement.dataset.networkQuality = this.quality;
  }

  applyOptimizations() {
    if (this.quality === 'poor') {
      // Disable animations
      document.documentElement.classList.add('reduce-motion');

      // Load lower quality images if available
      document.querySelectorAll('[data-src-low]').forEach(img => {
        img.dataset.src = img.dataset.srcLow;
      });
    }
  }

  getQuality() {
    return this.quality;
  }
}

// ============================================
// MEMORY MANAGEMENT
// ============================================
class MemoryManager {
  constructor() {
    this.cleanupCallbacks = [];
    this.init();
  }

  init() {
    // Clean up when page is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.cleanup();
      }
    });

    // Clean up before page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  registerCleanup(callback) {
    this.cleanupCallbacks.push(callback);
  }

  cleanup() {
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (e) {
        console.error('Cleanup error:', e);
      }
    });
  }
}

// ============================================
// SCROLL PERFORMANCE
// ============================================
class ScrollOptimizer {
  constructor() {
    this.ticking = false;
    this.lastScrollY = 0;
    this.callbacks = [];
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      this.lastScrollY = window.scrollY;

      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.executeCallbacks();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }

  onScroll(callback) {
    this.callbacks.push(callback);
  }

  executeCallbacks() {
    this.callbacks.forEach(callback => {
      callback(this.lastScrollY);
    });
  }
}

// ============================================
// FONT LOADING OPTIMIZATION
// ============================================
class FontLoader {
  constructor() {
    this.fontsLoaded = false;
    this.init();
  }

  init() {
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        this.fontsLoaded = true;
        document.documentElement.classList.add('fonts-loaded');
      });
    } else {
      // Fallback - assume fonts loaded after timeout
      setTimeout(() => {
        document.documentElement.classList.add('fonts-loaded');
      }, 3000);
    }
  }
}

// ============================================
// IMAGE OPTIMIZATION
// ============================================
class ImageOptimizer {
  constructor() {
    this.supportsWebP = false;
    this.supportsAVIF = false;
    this.init();
  }

  async init() {
    this.supportsWebP = await this.checkWebP();
    this.supportsAVIF = await this.checkAVIF();

    document.documentElement.classList.toggle('webp', this.supportsWebP);
    document.documentElement.classList.toggle('avif', this.supportsAVIF);
  }

  checkWebP() {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img.width > 0 && img.height > 0);
      img.onerror = () => resolve(false);
      img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    });
  }

  checkAVIF() {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img.width > 0 && img.height > 0);
      img.onerror = () => resolve(false);
      img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgABpAQ0AIyAABAABkAGBAADAAAAPIAABg2';
    });
  }
}

// ============================================
// INITIALIZE OPTIMIZATIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all optimization modules
  window.lazyLoader = new LazyLoader();
  window.resourceHints = new ResourceHints();
  window.deferredLoader = new DeferredLoader();
  window.criticalCSS = new CriticalCSS();
  window.performanceMetrics = new PerformanceMetrics();
  window.networkQuality = new NetworkQuality();
  window.memoryManager = new MemoryManager();
  window.scrollOptimizer = new ScrollOptimizer();
  window.fontLoader = new FontLoader();
  window.imageOptimizer = new ImageOptimizer();

  console.log('Ziyo International - Performance optimizations initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LazyLoader,
    ResourceHints,
    DeferredLoader,
    PerformanceMetrics,
    NetworkQuality,
    MemoryManager,
    ScrollOptimizer,
    FontLoader,
    ImageOptimizer
  };
}

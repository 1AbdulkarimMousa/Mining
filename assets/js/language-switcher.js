/**
 * Ziyo International - Language Switcher
 * Bilingual support for English and Chinese
 * Version: 1.0
 */

class LanguageSwitcher {
  constructor() {
    this.currentLang = this.getStoredLanguage() || this.detectBrowserLanguage();
    this.translations = {};
    this.isLoaded = false;
    this.callbacks = [];

    this.init();
  }

  /**
   * Initialize the language switcher
   */
  async init() {
    await this.loadTranslations(this.currentLang);
    this.setupToggleListeners();
    this.updateDocumentLanguage();
    this.isLoaded = true;
    this.executeCallbacks();
  }

  /**
   * Get stored language from localStorage
   */
  getStoredLanguage() {
    return localStorage.getItem('ziyo_lang');
  }

  /**
   * Detect browser language
   */
  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh')) {
      return 'zh';
    }
    return 'en';
  }

  /**
   * Get language from URL parameter
   */
  getUrlLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang');
  }

  /**
   * Load translations from JSON file
   */
  async loadTranslations(lang) {
    try {
      const response = await fetch(`locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang} translations`);
      }
      this.translations = await response.json();
      this.applyTranslations();
      this.updateToggleButtons();
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        await this.loadTranslations('en');
      }
    }
  }

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  applyTranslations() {
    // Handle text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const value = this.getNestedValue(key);
      if (value) {
        element.textContent = value;
      }
    });

    // Handle placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const value = this.getNestedValue(key);
      if (value) {
        element.placeholder = value;
      }
    });

    // Handle title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const value = this.getNestedValue(key);
      if (value) {
        element.title = value;
      }
    });

    // Handle aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      const value = this.getNestedValue(key);
      if (value) {
        element.setAttribute('aria-label', value);
      }
    });

    // Handle HTML content
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const value = this.getNestedValue(key);
      if (value) {
        element.innerHTML = value;
      }
    });

    // Update page title
    if (this.translations.meta && this.translations.meta.title) {
      document.title = this.translations.meta.title;
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && this.translations.meta && this.translations.meta.description) {
      metaDesc.content = this.translations.meta.description;
    }
  }

  /**
   * Get nested value from translations object
   */
  getNestedValue(key) {
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }

    return value;
  }

  /**
   * Get translation value by key
   */
  t(key, fallback = '') {
    const value = this.getNestedValue(key);
    return value !== null ? value : fallback;
  }

  /**
   * Update document language attribute
   */
  updateDocumentLanguage() {
    document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.dir = 'ltr';

    // Add/remove Chinese font class
    if (this.currentLang === 'zh') {
      document.body.classList.add('lang-zh');
      document.body.classList.remove('lang-en');
    } else {
      document.body.classList.add('lang-en');
      document.body.classList.remove('lang-zh');
    }
  }

  /**
   * Setup toggle button listeners
   */
  setupToggleListeners() {
    document.querySelectorAll('[data-lang-toggle]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    });
  }

  /**
   * Update toggle button text
   */
  updateToggleButtons() {
    document.querySelectorAll('[data-lang-toggle]').forEach(button => {
      const toggleText = this.t('navigation.language_toggle');
      const textSpan = button.querySelector('.lang-text');
      if (textSpan) {
        textSpan.textContent = toggleText;
      } else {
        button.textContent = toggleText;
      }
    });
  }

  /**
   * Toggle between languages
   */
  async toggle() {
    this.currentLang = this.currentLang === 'en' ? 'zh' : 'en';
    localStorage.setItem('ziyo_lang', this.currentLang);

    await this.loadTranslations(this.currentLang);
    this.updateDocumentLanguage();

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: this.currentLang }
    }));
  }

  /**
   * Set specific language
   */
  async setLanguage(lang) {
    if (lang === this.currentLang) return;

    if (lang === 'en' || lang === 'zh') {
      this.currentLang = lang;
      localStorage.setItem('ziyo_lang', this.currentLang);

      await this.loadTranslations(this.currentLang);
      this.updateDocumentLanguage();

      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: this.currentLang }
      }));
    }
  }

  /**
   * Get current language
   */
  getLanguage() {
    return this.currentLang;
  }

  /**
   * Register callback to be executed when translations are loaded
   */
  onReady(callback) {
    if (this.isLoaded) {
      callback();
    } else {
      this.callbacks.push(callback);
    }
  }

  /**
   * Execute registered callbacks
   */
  executeCallbacks() {
    this.callbacks.forEach(callback => callback());
    this.callbacks = [];
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.langSwitcher = new LanguageSwitcher();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageSwitcher;
}

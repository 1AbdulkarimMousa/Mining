/**
 * Ziyo International - Cookie Consent Banner
 * GDPR & CCPA compliant cookie consent management
 * Version: 1.0
 */

// ============================================
// COOKIE CONSENT MANAGER
// ============================================
class CookieConsent {
  constructor(options = {}) {
    this.options = {
      cookieName: options.cookieName || 'ziyo_cookie_consent',
      cookieExpiry: options.cookieExpiry || 365,
      position: options.position || 'bottom', // 'bottom', 'top', 'bottom-left', 'bottom-right'
      theme: options.theme || 'dark',
      showManageButton: options.showManageButton !== false,
      categories: options.categories || ['necessary', 'analytics', 'marketing'],
      translations: {
        en: {
          title: 'Cookie Preferences',
          message: 'We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies.',
          acceptAll: 'Accept All',
          rejectAll: 'Reject All',
          manage: 'Manage Preferences',
          save: 'Save Preferences',
          necessary: 'Necessary',
          necessaryDesc: 'Essential for the website to function properly.',
          analytics: 'Analytics',
          analyticsDesc: 'Help us understand how visitors interact with our website.',
          marketing: 'Marketing',
          marketingDesc: 'Used to deliver personalized advertisements.',
          privacyLink: 'Privacy Policy',
          learnMore: 'Learn more'
        },
        zh: {
          title: 'Cookie 偏好设置',
          message: '我们使用 Cookie 来改善您在我们网站上的体验。继续浏览即表示您同意我们使用 Cookie。',
          acceptAll: '全部接受',
          rejectAll: '全部拒绝',
          manage: '管理偏好',
          save: '保存设置',
          necessary: '必要',
          necessaryDesc: '网站正常运行所必需的。',
          analytics: '分析',
          analyticsDesc: '帮助我们了解访问者如何与网站互动。',
          marketing: '营销',
          marketingDesc: '用于提供个性化广告。',
          privacyLink: '隐私政策',
          learnMore: '了解更多'
        },
        ...options.translations
      },
      onAccept: options.onAccept || null,
      onReject: options.onReject || null,
      onChange: options.onChange || null,
      ...options
    };

    this.consent = this.getStoredConsent();
    this.currentLang = 'en';
    this.modal = null;
    this.banner = null;

    this.init();
  }

  init() {
    // Detect language
    this.currentLang = document.documentElement.lang === 'zh' ? 'zh' : 'en';

    // Listen for language changes
    document.addEventListener('languageChanged', (e) => {
      this.currentLang = e.detail?.lang || 'en';
      this.updateText();
    });

    // Show banner if consent not given
    if (!this.consent) {
      this.showBanner();
    } else {
      // Apply stored consent
      this.applyConsent();
    }

    // Create manage preferences button if needed
    if (this.options.showManageButton) {
      this.createManageButton();
    }
  }

  t(key) {
    return this.options.translations[this.currentLang]?.[key] ||
           this.options.translations['en'][key] || key;
  }

  showBanner() {
    const position = this.getPositionClass();

    this.banner = document.createElement('div');
    this.banner.className = `cookie-banner ${position}`;
    this.banner.setAttribute('role', 'dialog');
    this.banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    this.banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <h4 id="cookie-banner-title" class="cookie-title">${this.t('title')}</h4>
          <p class="cookie-message">${this.t('message')}</p>
          <a href="privacy-policy.html" class="cookie-privacy-link">
            ${this.t('privacyLink')} <i class="fa-solid fa-external-link"></i>
          </a>
        </div>
        <div class="cookie-banner-actions">
          <button class="cookie-btn cookie-btn-secondary" data-action="manage">
            ${this.t('manage')}
          </button>
          <button class="cookie-btn cookie-btn-outline" data-action="reject">
            ${this.t('rejectAll')}
          </button>
          <button class="cookie-btn cookie-btn-primary" data-action="accept">
            ${this.t('acceptAll')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.banner);

    // Bind events
    this.banner.querySelector('[data-action="accept"]').addEventListener('click', () => this.acceptAll());
    this.banner.querySelector('[data-action="reject"]').addEventListener('click', () => this.rejectAll());
    this.banner.querySelector('[data-action="manage"]').addEventListener('click', () => this.showModal());

    // Animate in
    requestAnimationFrame(() => {
      this.banner.classList.add('visible');
    });
  }

  hideBanner() {
    if (this.banner) {
      this.banner.classList.remove('visible');
      setTimeout(() => {
        this.banner.remove();
        this.banner = null;
      }, 300);
    }
  }

  showModal() {
    this.hideBanner();

    this.modal = document.createElement('div');
    this.modal.className = 'cookie-modal-overlay';
    this.modal.innerHTML = `
      <div class="cookie-modal" role="dialog" aria-labelledby="cookie-modal-title">
        <div class="cookie-modal-header">
          <h3 id="cookie-modal-title">${this.t('title')}</h3>
          <button class="cookie-modal-close" aria-label="Close">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="cookie-modal-body">
          ${this.options.categories.map(cat => `
            <div class="cookie-category">
              <div class="cookie-category-header">
                <label class="cookie-toggle">
                  <input type="checkbox"
                         name="${cat}"
                         ${cat === 'necessary' ? 'checked disabled' : ''}
                         ${this.consent?.[cat] ? 'checked' : ''}>
                  <span class="cookie-toggle-slider"></span>
                </label>
                <div class="cookie-category-info">
                  <h5>${this.t(cat)}</h5>
                  <p>${this.t(cat + 'Desc')}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="cookie-modal-footer">
          <button class="cookie-btn cookie-btn-outline" data-action="reject-all">
            ${this.t('rejectAll')}
          </button>
          <button class="cookie-btn cookie-btn-secondary" data-action="save">
            ${this.t('save')}
          </button>
          <button class="cookie-btn cookie-btn-primary" data-action="accept-all">
            ${this.t('acceptAll')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    // Bind events
    this.modal.querySelector('.cookie-modal-close').addEventListener('click', () => this.hideModal());
    this.modal.querySelector('[data-action="accept-all"]').addEventListener('click', () => this.acceptAll());
    this.modal.querySelector('[data-action="reject-all"]').addEventListener('click', () => this.rejectAll());
    this.modal.querySelector('[data-action="save"]').addEventListener('click', () => this.savePreferences());

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hideModal();
    });

    // Escape key
    document.addEventListener('keydown', this.handleEscape);

    // Animate in
    requestAnimationFrame(() => {
      this.modal.classList.add('visible');
    });

    // Trap focus
    this.trapFocus(this.modal.querySelector('.cookie-modal'));
  }

  hideModal() {
    if (this.modal) {
      this.modal.classList.remove('visible');
      setTimeout(() => {
        this.modal.remove();
        this.modal = null;
      }, 300);
      document.removeEventListener('keydown', this.handleEscape);
    }
  }

  handleEscape = (e) => {
    if (e.key === 'Escape') this.hideModal();
  }

  trapFocus(element) {
    const focusable = element.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    element.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    });
  }

  acceptAll() {
    this.consent = {};
    this.options.categories.forEach(cat => {
      this.consent[cat] = true;
    });

    this.saveConsent();
    this.applyConsent();
    this.hideBanner();
    this.hideModal();

    if (this.options.onAccept) {
      this.options.onAccept(this.consent);
    }
  }

  rejectAll() {
    this.consent = { necessary: true };
    this.options.categories.forEach(cat => {
      if (cat !== 'necessary') this.consent[cat] = false;
    });

    this.saveConsent();
    this.applyConsent();
    this.hideBanner();
    this.hideModal();

    if (this.options.onReject) {
      this.options.onReject(this.consent);
    }
  }

  savePreferences() {
    this.consent = { necessary: true };

    this.modal.querySelectorAll('.cookie-category input').forEach(input => {
      this.consent[input.name] = input.checked;
    });

    this.saveConsent();
    this.applyConsent();
    this.hideModal();

    if (this.options.onChange) {
      this.options.onChange(this.consent);
    }
  }

  saveConsent() {
    const data = {
      consent: this.consent,
      timestamp: Date.now(),
      version: '1.0'
    };

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + this.options.cookieExpiry);

    document.cookie = `${this.options.cookieName}=${encodeURIComponent(JSON.stringify(data))};expires=${expiry.toUTCString()};path=/;SameSite=Lax`;

    // Also store in localStorage for quick access
    localStorage.setItem(this.options.cookieName, JSON.stringify(data));
  }

  getStoredConsent() {
    // Try localStorage first
    const stored = localStorage.getItem(this.options.cookieName);
    if (stored) {
      try {
        return JSON.parse(stored).consent;
      } catch (e) {
        return null;
      }
    }

    // Fallback to cookie
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith(this.options.cookieName));
    if (cookie) {
      try {
        return JSON.parse(decodeURIComponent(cookie.split('=')[1])).consent;
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  applyConsent() {
    // Dispatch event for other scripts to listen
    document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: this.consent
    }));

    // Enable/disable analytics based on consent
    if (this.consent.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }

    // Enable/disable marketing based on consent
    if (this.consent.marketing) {
      this.enableMarketing();
    } else {
      this.disableMarketing();
    }
  }

  enableAnalytics() {
    // Enable Google Analytics or similar
    window['ga-disable-UA-XXXXX-Y'] = false;
    console.log('Analytics cookies enabled');
  }

  disableAnalytics() {
    // Disable Google Analytics
    window['ga-disable-UA-XXXXX-Y'] = true;
    console.log('Analytics cookies disabled');
  }

  enableMarketing() {
    // Enable marketing/advertising cookies
    console.log('Marketing cookies enabled');
  }

  disableMarketing() {
    // Disable marketing cookies
    console.log('Marketing cookies disabled');
  }

  createManageButton() {
    const button = document.createElement('button');
    button.className = 'cookie-manage-btn';
    button.setAttribute('aria-label', 'Manage cookie preferences');
    button.innerHTML = '<i class="fa-solid fa-cookie-bite"></i>';
    button.addEventListener('click', () => this.showModal());
    document.body.appendChild(button);
  }

  updateText() {
    // Update banner text if visible
    if (this.banner) {
      this.banner.querySelector('.cookie-title').textContent = this.t('title');
      this.banner.querySelector('.cookie-message').textContent = this.t('message');
      this.banner.querySelector('[data-action="accept"]').textContent = this.t('acceptAll');
      this.banner.querySelector('[data-action="reject"]').textContent = this.t('rejectAll');
      this.banner.querySelector('[data-action="manage"]').textContent = this.t('manage');
    }
  }

  getPositionClass() {
    switch (this.options.position) {
      case 'top': return 'position-top';
      case 'bottom-left': return 'position-bottom-left';
      case 'bottom-right': return 'position-bottom-right';
      default: return 'position-bottom';
    }
  }

  // Public API
  getConsent() {
    return this.consent;
  }

  hasConsent(category) {
    return this.consent?.[category] || false;
  }

  revokeConsent() {
    localStorage.removeItem(this.options.cookieName);
    document.cookie = `${this.options.cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    this.consent = null;
    this.showBanner();
  }
}

// ============================================
// COOKIE CONSENT STYLES - BRIGHT THEME
// ============================================
const cookieStyles = document.createElement('style');
cookieStyles.textContent = `
  /* Cookie Banner - Bright Theme Compact Mobile Design */
  .cookie-banner {
    position: fixed;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border-light, #E5E7EB);
    padding: 16px;
    z-index: 10000;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  }

  .cookie-banner.position-bottom { bottom: 0; }
  .cookie-banner.position-top {
    top: 0;
    bottom: auto;
    transform: translateY(-100%);
    border-top: none;
    border-bottom: 1px solid var(--border-light, #E5E7EB);
  }
  .cookie-banner.position-bottom-left,
  .cookie-banner.position-bottom-right {
    bottom: 20px;
    left: auto;
    right: auto;
    max-width: 360px;
    border-radius: 16px;
    border: 1px solid var(--border-light, #E5E7EB);
  }
  .cookie-banner.position-bottom-left { left: 20px; }
  .cookie-banner.position-bottom-right { right: 20px; }

  .cookie-banner.visible { transform: translateY(0); }
  .cookie-banner.position-top.visible { transform: translateY(0); }

  .cookie-banner-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .cookie-banner.position-bottom-left .cookie-banner-content,
  .cookie-banner.position-bottom-right .cookie-banner-content {
    flex-direction: column;
    align-items: stretch;
  }

  .cookie-banner-text {
    flex: 1;
  }

  .cookie-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary, #1A1A2E);
    margin: 0 0 6px;
  }

  .cookie-message {
    font-size: 13px;
    color: var(--text-secondary, #6B7280);
    margin: 0 0 6px;
    line-height: 1.5;
  }

  .cookie-privacy-link {
    font-size: 12px;
    color: var(--copper-gold, #B87333);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .cookie-privacy-link:hover {
    text-decoration: underline;
  }

  .cookie-banner-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  /* Cookie Buttons - Bright Theme */
  .cookie-btn {
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    white-space: nowrap;
    min-height: 44px;
  }

  .cookie-btn-primary {
    background: var(--copper-gradient, linear-gradient(135deg, #B87333, #CD853F));
    color: #FFFFFF;
  }

  .cookie-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(184, 115, 51, 0.3);
  }

  .cookie-btn-secondary {
    background: var(--bg-secondary, #F0F2F5);
    color: var(--text-primary, #1A1A2E);
    border: 1px solid var(--border-light, #E5E7EB);
  }

  .cookie-btn-secondary:hover {
    background: var(--bg-tertiary, #E5E7EB);
  }

  .cookie-btn-outline {
    background: transparent;
    color: var(--text-secondary, #6B7280);
    border: 1px solid var(--border-light, #E5E7EB);
  }

  .cookie-btn-outline:hover {
    border-color: var(--copper-gold, #B87333);
    color: var(--copper-gold, #B87333);
  }

  /* Cookie Modal - Bright Theme */
  .cookie-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .cookie-modal-overlay.visible {
    opacity: 1;
  }

  .cookie-modal {
    background: #FFFFFF;
    border: 1px solid var(--border-light, #E5E7EB);
    border-radius: 16px;
    max-width: 480px;
    width: 100%;
    max-height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transform: scale(0.95);
    transition: transform 0.3s ease;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  .cookie-modal-overlay.visible .cookie-modal {
    transform: scale(1);
  }

  .cookie-modal-header {
    padding: 20px;
    border-bottom: 1px solid var(--border-light, #E5E7EB);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cookie-modal-header h3 {
    font-size: 17px;
    font-weight: 600;
    color: var(--text-primary, #1A1A2E);
    margin: 0;
  }

  .cookie-modal-close {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--bg-secondary, #F0F2F5);
    border: none;
    color: var(--text-secondary, #6B7280);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .cookie-modal-close:hover {
    background: var(--bg-tertiary, #E5E7EB);
    color: var(--text-primary, #1A1A2E);
  }

  .cookie-modal-body {
    padding: 16px 20px;
    overflow-y: auto;
    flex: 1;
  }

  .cookie-category {
    padding: 14px 0;
    border-bottom: 1px solid var(--border-light, #E5E7EB);
  }

  .cookie-category:last-child {
    border-bottom: none;
  }

  .cookie-category-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .cookie-category-info h5 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary, #1A1A2E);
    margin: 0 0 4px;
  }

  .cookie-category-info p {
    font-size: 12px;
    color: var(--text-secondary, #6B7280);
    margin: 0;
    line-height: 1.5;
  }

  /* Toggle Switch - Bright Theme */
  .cookie-toggle {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
  }

  .cookie-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .cookie-toggle-slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: var(--bg-tertiary, #E5E7EB);
    border-radius: 24px;
    transition: 0.3s;
  }

  .cookie-toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: #FFFFFF;
    border-radius: 50%;
    transition: 0.3s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }

  .cookie-toggle input:checked + .cookie-toggle-slider {
    background: var(--copper-gold, #B87333);
  }

  .cookie-toggle input:checked + .cookie-toggle-slider:before {
    transform: translateX(20px);
    background: #FFFFFF;
  }

  .cookie-toggle input:disabled + .cookie-toggle-slider {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cookie-modal-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--border-light, #E5E7EB);
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  /* Manage Button - Bright Theme */
  .cookie-manage-btn {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 1px solid var(--border-light, #E5E7EB);
    color: var(--copper-gold, #B87333);
    font-size: 18px;
    cursor: pointer;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  }

  .cookie-manage-btn:hover {
    transform: scale(1.1);
    background: var(--copper-gold, #B87333);
    color: #FFFFFF;
  }

  /* Mobile Responsive - Compact Design */
  @media (max-width: 768px) {
    .cookie-banner {
      padding: 12px 16px;
    }

    .cookie-banner-content {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .cookie-title {
      font-size: 14px;
      margin-bottom: 4px;
    }

    .cookie-message {
      font-size: 12px;
      margin-bottom: 4px;
    }

    .cookie-banner-actions {
      justify-content: stretch;
      gap: 6px;
    }

    .cookie-banner-actions .cookie-btn {
      flex: 1;
      padding: 10px 12px;
      font-size: 12px;
      min-height: 40px;
    }

    /* Hide manage button on mobile to save space */
    .cookie-banner-actions .cookie-btn[data-action="manage"] {
      display: none;
    }

    .cookie-modal {
      max-height: 80vh;
      margin: 10px;
    }

    .cookie-modal-header {
      padding: 16px;
    }

    .cookie-modal-body {
      padding: 12px 16px;
    }

    .cookie-modal-footer {
      flex-direction: column;
      padding: 12px 16px;
    }

    .cookie-modal-footer .cookie-btn {
      width: 100%;
    }

    .cookie-manage-btn {
      bottom: 80px;
      width: 40px;
      height: 40px;
      font-size: 16px;
    }
  }
`;
document.head.appendChild(cookieStyles);

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  window.cookieConsent = new CookieConsent({
    position: 'bottom',
    showManageButton: true,
    onAccept: (consent) => {
      console.log('Cookies accepted:', consent);
    },
    onReject: (consent) => {
      console.log('Cookies rejected:', consent);
    },
    onChange: (consent) => {
      console.log('Cookie preferences changed:', consent);
    }
  });
});

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CookieConsent };
}

console.log('Ziyo Cookie Consent - GDPR compliant cookie management loaded');

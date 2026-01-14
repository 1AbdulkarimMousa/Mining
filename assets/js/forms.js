/**
 * Ziyo International - Form Handling
 * Enhanced form validation, submission, and user feedback
 * Version: 1.0
 */

// ============================================
// FORM VALIDATOR CLASS
// ============================================
class FormValidator {
  constructor(form, options = {}) {
    this.form = form;
    this.options = {
      errorClass: 'is-invalid',
      successClass: 'is-valid',
      errorMessageClass: 'error-message',
      validateOnBlur: true,
      validateOnInput: false,
      ...options
    };
    this.fields = {};
    this.init();
  }

  init() {
    if (!this.form) return;

    // Get all form fields
    this.form.querySelectorAll('input, textarea, select').forEach(field => {
      const name = field.name || field.id;
      if (name) {
        this.fields[name] = {
          element: field,
          rules: this.parseRules(field),
          valid: true
        };

        // Add event listeners
        if (this.options.validateOnBlur) {
          field.addEventListener('blur', () => this.validateField(name));
        }
        if (this.options.validateOnInput) {
          field.addEventListener('input', () => this.validateField(name));
        }
        field.addEventListener('input', () => this.clearError(field));
      }
    });

    // Form submit handler
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  parseRules(field) {
    const rules = [];

    if (field.hasAttribute('required')) {
      rules.push({ type: 'required', message: 'This field is required' });
    }

    if (field.type === 'email') {
      rules.push({
        type: 'email',
        message: 'Please enter a valid email address',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      });
    }

    if (field.type === 'tel') {
      rules.push({
        type: 'phone',
        message: 'Please enter a valid phone number',
        pattern: /^[\d\s+\-()]{8,}$/
      });
    }

    if (field.minLength > 0) {
      rules.push({
        type: 'minLength',
        message: `Minimum ${field.minLength} characters required`,
        value: field.minLength
      });
    }

    if (field.maxLength > 0 && field.maxLength < 524288) {
      rules.push({
        type: 'maxLength',
        message: `Maximum ${field.maxLength} characters allowed`,
        value: field.maxLength
      });
    }

    if (field.pattern) {
      rules.push({
        type: 'pattern',
        message: field.title || 'Please match the required format',
        pattern: new RegExp(field.pattern)
      });
    }

    return rules;
  }

  validateField(name) {
    const fieldData = this.fields[name];
    if (!fieldData) return true;

    const { element, rules } = fieldData;
    const value = element.value.trim();
    let isValid = true;
    let errorMessage = '';

    for (const rule of rules) {
      switch (rule.type) {
        case 'required':
          if (!value) {
            isValid = false;
            errorMessage = rule.message;
          }
          break;

        case 'email':
          if (value && !rule.pattern.test(value)) {
            isValid = false;
            errorMessage = rule.message;
          }
          break;

        case 'phone':
          if (value && !rule.pattern.test(value)) {
            isValid = false;
            errorMessage = rule.message;
          }
          break;

        case 'minLength':
          if (value && value.length < rule.value) {
            isValid = false;
            errorMessage = rule.message;
          }
          break;

        case 'maxLength':
          if (value && value.length > rule.value) {
            isValid = false;
            errorMessage = rule.message;
          }
          break;

        case 'pattern':
          if (value && !rule.pattern.test(value)) {
            isValid = false;
            errorMessage = rule.message;
          }
          break;
      }

      if (!isValid) break;
    }

    fieldData.valid = isValid;

    if (!isValid) {
      this.showError(element, errorMessage);
    } else {
      this.showSuccess(element);
    }

    return isValid;
  }

  validateAll() {
    let allValid = true;

    for (const name in this.fields) {
      if (!this.validateField(name)) {
        allValid = false;
      }
    }

    return allValid;
  }

  showError(field, message) {
    field.classList.remove(this.options.successClass);
    field.classList.add(this.options.errorClass);

    let errorEl = field.parentNode.querySelector(`.${this.options.errorMessageClass}`);
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = this.options.errorMessageClass;
      field.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.style.color = '#ff6b6b';
    errorEl.style.fontSize = '0.875rem';
    errorEl.style.marginTop = '0.25rem';
  }

  showSuccess(field) {
    field.classList.remove(this.options.errorClass);
    if (field.value.trim()) {
      field.classList.add(this.options.successClass);
    }

    const errorEl = field.parentNode.querySelector(`.${this.options.errorMessageClass}`);
    if (errorEl) {
      errorEl.remove();
    }
  }

  clearError(field) {
    field.classList.remove(this.options.errorClass);
    const errorEl = field.parentNode.querySelector(`.${this.options.errorMessageClass}`);
    if (errorEl) {
      errorEl.remove();
    }
  }

  handleSubmit(e) {
    if (!this.validateAll()) {
      e.preventDefault();

      // Focus first invalid field
      for (const name in this.fields) {
        if (!this.fields[name].valid) {
          this.fields[name].element.focus();
          break;
        }
      }
    }
  }

  reset() {
    for (const name in this.fields) {
      const field = this.fields[name].element;
      field.classList.remove(this.options.errorClass, this.options.successClass);
      this.clearError(field);
      this.fields[name].valid = true;
    }
  }
}

// ============================================
// CONTACT FORM HANDLER
// ============================================
class ContactFormHandler {
  constructor(formId, options = {}) {
    this.form = document.getElementById(formId);
    this.options = {
      successMessageId: 'formSuccess',
      errorMessageId: 'formError',
      loadingClass: 'loading',
      endpoint: null, // For actual form submission
      successCallback: null,
      errorCallback: null,
      ...options
    };

    this.validator = null;
    this.isSubmitting = false;
    this.init();
  }

  init() {
    if (!this.form) return;

    // Initialize validator
    this.validator = new FormValidator(this.form, {
      validateOnBlur: true
    });

    // Override form submit
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) return;
    if (!this.validator.validateAll()) return;

    this.isSubmitting = true;
    this.showLoading();

    try {
      // Collect form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      // If endpoint provided, submit to server
      if (this.options.endpoint) {
        const response = await fetch(this.options.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }
      } else {
        // Simulate submission delay
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      this.showSuccess();

      if (this.options.successCallback) {
        this.options.successCallback(data);
      }

      // Reset form
      this.form.reset();
      this.validator.reset();

    } catch (error) {
      console.error('Form submission error:', error);
      this.showError();

      if (this.options.errorCallback) {
        this.options.errorCallback(error);
      }
    } finally {
      this.isSubmitting = false;
      this.hideLoading();
    }
  }

  showLoading() {
    this.form.classList.add(this.options.loadingClass);

    const submitBtn = this.form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Sending...
      `;
    }
  }

  hideLoading() {
    this.form.classList.remove(this.options.loadingClass);

    const submitBtn = this.form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      if (submitBtn.dataset.originalText) {
        submitBtn.innerHTML = submitBtn.dataset.originalText;
      }
    }
  }

  showSuccess() {
    const successEl = document.getElementById(this.options.successMessageId);
    if (successEl) {
      successEl.classList.remove('d-none');
      successEl.classList.add('show');

      // Auto-hide after 5 seconds
      setTimeout(() => {
        successEl.classList.add('d-none');
        successEl.classList.remove('show');
      }, 5000);
    }
  }

  showError() {
    const errorEl = document.getElementById(this.options.errorMessageId);
    if (errorEl) {
      errorEl.classList.remove('d-none');
      errorEl.classList.add('show');

      setTimeout(() => {
        errorEl.classList.add('d-none');
        errorEl.classList.remove('show');
      }, 5000);
    }
  }
}

// ============================================
// NEWSLETTER SIGNUP HANDLER
// ============================================
class NewsletterHandler {
  constructor(formId, options = {}) {
    this.form = document.getElementById(formId);
    this.options = {
      endpoint: null,
      successMessage: 'Thank you for subscribing!',
      errorMessage: 'Subscription failed. Please try again.',
      ...options
    };

    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const emailInput = this.form.querySelector('input[type="email"]');
    if (!emailInput) return;

    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      this.showFeedback('Please enter a valid email address', 'error');
      return;
    }

    const submitBtn = this.form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      if (this.options.endpoint) {
        await fetch(this.options.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      this.showFeedback(this.options.successMessage, 'success');
      this.form.reset();

    } catch (error) {
      this.showFeedback(this.options.errorMessage, 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  }

  showFeedback(message, type) {
    let feedbackEl = this.form.querySelector('.newsletter-feedback');
    if (!feedbackEl) {
      feedbackEl = document.createElement('div');
      feedbackEl.className = 'newsletter-feedback mt-2';
      this.form.appendChild(feedbackEl);
    }

    feedbackEl.textContent = message;
    feedbackEl.style.color = type === 'success' ? '#50C878' : '#ff6b6b';
    feedbackEl.style.fontSize = '0.875rem';

    setTimeout(() => {
      feedbackEl.remove();
    }, 4000);
  }
}

// ============================================
// INPUT FORMATTING
// ============================================
class InputFormatter {
  static formatPhone(input) {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      // Format as: +XX XXX XXX XXXX or similar
      if (value.length > 0) {
        if (value.length <= 3) {
          value = value;
        } else if (value.length <= 6) {
          value = `${value.slice(0, 3)} ${value.slice(3)}`;
        } else if (value.length <= 10) {
          value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
        } else {
          value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 10)} ${value.slice(10, 14)}`;
        }
      }

      e.target.value = value;
    });
  }

  static formatCurrency(input, options = {}) {
    const { currency = 'USD', locale = 'en-US' } = options;

    input.addEventListener('blur', (e) => {
      const value = parseFloat(e.target.value.replace(/[^\d.]/g, ''));
      if (!isNaN(value)) {
        e.target.value = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency
        }).format(value);
      }
    });

    input.addEventListener('focus', (e) => {
      e.target.value = e.target.value.replace(/[^\d.]/g, '');
    });
  }
}

// ============================================
// FLOATING LABELS
// ============================================
class FloatingLabels {
  constructor(container) {
    this.container = container || document;
    this.init();
  }

  init() {
    this.container.querySelectorAll('.form-floating').forEach(wrapper => {
      const input = wrapper.querySelector('input, textarea, select');
      const label = wrapper.querySelector('label');

      if (input && label) {
        // Check initial value
        this.checkValue(input, label);

        // Listen for changes
        input.addEventListener('input', () => this.checkValue(input, label));
        input.addEventListener('focus', () => label.classList.add('focused'));
        input.addEventListener('blur', () => {
          label.classList.remove('focused');
          this.checkValue(input, label);
        });
      }
    });
  }

  checkValue(input, label) {
    if (input.value.trim()) {
      label.classList.add('has-value');
    } else {
      label.classList.remove('has-value');
    }
  }
}

// ============================================
// INITIALIZE FORMS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize contact form if exists
  if (document.getElementById('contactForm')) {
    window.contactFormHandler = new ContactFormHandler('contactForm', {
      successMessageId: 'formSuccess',
      errorMessageId: 'formError'
    });
  }

  // Initialize newsletter forms
  document.querySelectorAll('[data-newsletter]').forEach(form => {
    new NewsletterHandler(form.id);
  });

  // Format phone inputs
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    InputFormatter.formatPhone(input);
  });

  // Initialize floating labels
  new FloatingLabels();

  console.log('Ziyo International - Form handlers initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FormValidator,
    ContactFormHandler,
    NewsletterHandler,
    InputFormatter,
    FloatingLabels
  };
}

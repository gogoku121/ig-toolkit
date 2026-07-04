// Toast notification component
import { createElement, fadeIn, fadeOut } from '../core/dom.js';

export class Toast {
  constructor(options = {}) {
    this.message = options.message || '';
    this.type = options.type || 'info'; // info, success, error, warning
    this.duration = options.duration || 2500;
    this.dismissible = options.dismissible !== false;
    this.element = null;
    this._timeout = null;
  }

  _build() {
    this.element = createElement('div', {
      className: `toast toast-${this.type}`,
      role: 'alert',
      aria: {
        live: 'polite',
        atomic: 'true'
      }
    });

    // Icon
    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const iconEl = createElement('span', { className: 'toast-icon', ariaHidden: 'true' }, [icons[this.type] || icons.info]);
    const messageEl = createElement('span', { className: 'toast-message' }, [this.message]);
    
    this.element.appendChild(iconEl);
    this.element.appendChild(messageEl);

    if (this.dismissible) {
      const closeBtn = createElement('button', {
        className: 'toast-close',
        type: 'button',
        aria: { label: 'Dismiss notification' }
      }, ['×']);
      closeBtn.addEventListener('click', () => this.hide());
      this.element.appendChild(closeBtn);
    }
  }

  show(container = document.body) {
    if (!this.element) {
      this._build();
    }

    // Check if container is body or a specific element
    if (container === document.body) {
      container.appendChild(this.element);
    } else {
      container.appendChild(this.element);
    }

    requestAnimationFrame(() => {
      this.element.classList.add('toast-show');
    });

    if (this.duration > 0) {
      this._timeout = setTimeout(() => this.hide(), this.duration);
    }

    return this;
  }

  hide() {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    if (this.element) {
      this.element.classList.remove('toast-show');
      this.element.classList.add('toast-hide');
      
      setTimeout(() => {
        if (this.element && this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
      }, 300);
    }

    return this;
  }

  static show(message, type = 'info', options = {}) {
    const toast = new Toast({ message, type, ...options });
    return toast.show();
  }

  static success(message, options = {}) {
    return Toast.show(message, 'success', options);
  }

  static error(message, options = {}) {
    return Toast.show(message, 'error', { duration: 4000, ...options });
  }

  static warning(message, options = {}) {
    return Toast.show(message, 'warning', options);
  }

  static info(message, options = {}) {
    return Toast.show(message, 'info', options);
  }
}

export default Toast;

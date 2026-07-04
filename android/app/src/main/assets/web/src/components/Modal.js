// Modal component with focus trap and accessibility
import { createElement, createFocusTrap } from '../core/dom.js';

export class Modal {
  constructor(options = {}) {
    this.id = options.id || `modal-${Date.now()}`;
    this.title = options.title || '';
    this.content = options.content || '';
    this.size = options.size || 'medium'; // small, medium, large
    this.closable = options.closable !== false;
    this.onClose = options.onClose || null;
    this._previousFocus = null;
    this._focusTrap = null;
    this.element = null;
  }

  _build() {
    // Create backdrop
    const backdrop = createElement('div', {
      className: 'modal-backdrop',
      id: `${this.id}-backdrop`
    });

    // Create modal container
    this.element = createElement('div', {
      className: `modal modal-${this.size}`,
      id: this.id,
      role: 'dialog',
      aria: {
        modal: 'true',
        labelledby: `${this.id}-title`
      }
    });

    // Create modal content
    const modalContent = createElement('div', { className: 'modal-content' });

    // Header
    const header = createElement('header', { className: 'modal-header' });
    
    const titleEl = createElement('h2', {
      id: `${this.id}-title`,
      className: 'modal-title'
    }, [this.title]);
    header.appendChild(titleEl);

    if (this.closable) {
      const closeBtn = createElement('button', {
        type: 'button',
        className: 'modal-close',
        aria: { label: 'Close modal' }
      }, ['×']);
      closeBtn.addEventListener('click', () => this.close());
      header.appendChild(closeBtn);
    }

    modalContent.appendChild(header);

    // Body
    const body = createElement('div', { className: 'modal-body' });
    if (typeof this.content === 'string') {
      body.textContent = this.content;
    } else if (this.content instanceof HTMLElement) {
      body.appendChild(this.content);
    }
    modalContent.appendChild(body);

    this.element.appendChild(modalContent);

    // Event listeners
    backdrop.addEventListener('click', () => {
      if (this.closable) this.close();
    });

    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.closable) {
        this.close();
      }
    });
  }

  show() {
    if (!this.element) {
      this._build();
    }

    // Store current focus
    this._previousFocus = document.activeElement;

    // Add to DOM
    document.body.appendChild(this.element);
    document.body.classList.add('modal-open');

    // Trap focus
    this._focusTrap = createFocusTrap(this.element);

    // Focus first focusable element
    const firstFocusable = this.element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    firstFocusable?.focus();

    return this;
  }

  close() {
    if (this._focusTrap) {
      this._focusTrap();
      this._focusTrap = null;
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    document.body.classList.remove('modal-open');

    // Restore focus
    if (this._previousFocus && this._previousFocus.focus) {
      this._previousFocus.focus();
    }

    if (this.onClose) {
      this.onClose();
    }

    return this;
  }

  setContent(content) {
    const body = this.element?.querySelector('.modal-body');
    if (body) {
      if (typeof content === 'string') {
        body.textContent = content;
      } else {
        body.innerHTML = '';
        body.appendChild(content);
      }
    }
  }

  static confirm(message, options = {}) {
    return new Promise((resolve) => {
      const modal = new Modal({
        title: options.title || 'Confirm',
        content: message,
        closable: true,
        onClose: () => resolve(false)
      });

      const confirmBtn = createElement('button', {
        type: 'button',
        className: 'btn btn-primary'
      }, [options.confirmText || 'Confirm']);
      
      const cancelBtn = createElement('button', {
        type: 'button',
        className: 'btn btn-secondary'
      }, [options.cancelText || 'Cancel']);

      confirmBtn.addEventListener('click', () => {
        modal.close();
        resolve(true);
      });

      cancelBtn.addEventListener('click', () => {
        modal.close();
        resolve(false);
      });

      const footer = createElement('footer', { className: 'modal-footer' });
      footer.appendChild(cancelBtn);
      footer.appendChild(confirmBtn);

      modal.element.querySelector('.modal-content').appendChild(footer);
      modal.show();
    });
  }

  static alert(message, options = {}) {
    return new Promise((resolve) => {
      const modal = new Modal({
        title: options.title || 'Alert',
        content: message,
        closable: true,
        onClose: resolve
      });

      const okBtn = createElement('button', {
        type: 'button',
        className: 'btn btn-primary'
      }, [options.okText || 'OK']);

      okBtn.addEventListener('click', () => {
        modal.close();
        resolve();
      });

      const footer = createElement('footer', { className: 'modal-footer' });
      footer.appendChild(okBtn);

      modal.element.querySelector('.modal-content').appendChild(footer);
      modal.show();
    });
  }
}

export default Modal;

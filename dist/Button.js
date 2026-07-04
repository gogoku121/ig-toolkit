// Button component with loading state
import { createElement, escapeHtml } from '../core/dom.js';

export class Button {
  constructor(options = {}) {
    this.text = options.text || 'Button';
    this.variant = options.variant || 'primary'; // primary, secondary, ghost
    this.size = options.size || 'medium'; // small, medium, large
    this.disabled = options.disabled || false;
    this.loading = options.loading || false;
    this.icon = options.icon || null;
    this.onClick = options.onClick || null;
    this.className = options.className || '';
    this.id = options.id || `btn-${Date.now()}`;
    this.element = null;
    this._build();
  }

  _build() {
    const classes = [
      'btn',
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.loading ? 'btn-loading' : '',
      this.disabled ? 'btn-disabled' : '',
      this.className
    ].filter(Boolean).join(' ');

    this.element = createElement('button', {
      type: 'button',
      id: this.id,
      className: classes,
      disabled: this.disabled || this.loading,
      aria: {
        busy: this.loading ? 'true' : 'false',
        disabled: this.disabled ? 'true' : 'false'
      }
    });

    if (this.loading) {
      this._spinner = createElement('span', { className: 'btn-spinner', ariaHidden: 'true' });
      this._label = createElement('span', { className: 'btn-label' }, [this.text]);
      this.element.appendChild(this._spinner);
      this.element.appendChild(this._label);
    } else {
      if (this.icon) {
        this.element.innerHTML = this.icon;
      }
      this.element.textContent = this.icon ? '' : this.text;
      if (this.icon) {
        const textNode = document.createTextNode(` ${this.text}`);
        this.element.appendChild(textNode);
      }
    }

    if (this.onClick) {
      this.element.addEventListener('click', (e) => {
        if (!this.disabled && !this.loading) {
          this.onClick(e);
        }
      });
    }
  }

  setLoading(loading) {
    this.loading = loading;
    this.element.disabled = loading;
    this.element.setAttribute('aria-busy', loading ? 'true' : 'false');
    this.element.classList.toggle('btn-loading', loading);
  }

  setDisabled(disabled) {
    this.disabled = disabled;
    this.element.disabled = disabled;
    this.element.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.element.classList.toggle('btn-disabled', disabled);
  }

  setText(text) {
    this.text = text;
    if (this.loading) {
      this._label.textContent = text;
    } else {
      const hasIcon = this.icon !== null;
      this.element.textContent = hasIcon ? '' : text;
      if (hasIcon) {
        const textNode = document.createTextNode(` ${text}`);
        this.element.appendChild(textNode);
      }
    }
  }

  on(eventType, handler) {
    this.element.addEventListener(eventType, handler);
    return this;
  }

  destroy() {
    this.element.remove();
  }

  render(container) {
    if (container) {
      container.appendChild(this.element);
    }
    return this.element;
  }
}

export default Button;

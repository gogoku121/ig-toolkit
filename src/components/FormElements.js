// Form element components (Input, Select, Slider, Textarea)
import { createElement, escapeHtml } from '../core/dom.js';

export class Input {
  constructor(options = {}) {
    this.label = options.label || '';
    this.placeholder = options.placeholder || '';
    this.value = options.value || '';
    this.type = options.type || 'text';
    this.id = options.id || `input-${Date.now()}`;
    this.name = options.name || this.id;
    this.required = options.required || false;
    this.disabled = options.disabled || false;
    this.error = options.error || '';
    this.onChange = options.onChange || null;
    this.element = null;
    this._inputEl = null;
    this._build();
  }

  _build() {
    this.element = createElement('div', { className: 'form-group' });

    if (this.label) {
      const labelEl = createElement('label', {
        for: this.id,
        className: 'form-label'
      }, [this.label]);
      this.element.appendChild(labelEl);
    }

    this._inputEl = createElement('input', {
      type: this.type,
      id: this.id,
      name: this.name,
      className: 'form-input' + (this.error ? ' form-input-error' : ''),
      placeholder: this.placeholder,
      value: this.value,
      disabled: this.disabled,
      required: this.required,
      aria: {
        describedby: this.error ? `${this.id}-error` : undefined,
        invalid: this.error ? 'true' : 'false'
      }
    });

    if (this.onChange) {
      this._inputEl.addEventListener('input', (e) => {
        this.value = e.target.value;
        this.onChange(e.target.value, e);
      });
      this._inputEl.addEventListener('change', (e) => {
        this.onChange(e.target.value, e);
      });
    }

    this.element.appendChild(this._inputEl);

    if (this.error) {
      const errorEl = createElement('span', {
        id: `${this.id}-error`,
        className: 'form-error',
        role: 'alert'
      }, [this.error]);
      this.element.appendChild(errorEl);
    }
  }

  getValue() {
    return this._inputEl.value;
  }

  setValue(value) {
    this.value = value;
    this._inputEl.value = value;
  }

  setError(error) {
    this.error = error;
    this._inputEl.classList.toggle('form-input-error', !!error);
    this._inputEl.setAttribute('aria-invalid', !!error);
    
    const existingError = this.element.querySelector('.form-error');
    if (existingError) existingError.remove();

    if (error) {
      const errorEl = createElement('span', {
        id: `${this.id}-error`,
        className: 'form-error',
        role: 'alert'
      }, [error]);
      this.element.appendChild(errorEl);
    }
  }

  focus() {
    this._inputEl.focus();
  }

  disable() {
    this.disabled = true;
    this._inputEl.disabled = true;
  }

  enable() {
    this.disabled = false;
    this._inputEl.disabled = false;
  }

  render(container) {
    container.appendChild(this.element);
    return this.element;
  }
}

export class Select {
  constructor(options = {}) {
    this.label = options.label || '';
    this.options = options.options || [];
    this.value = options.value || '';
    this.id = options.id || `select-${Date.now()}`;
    this.name = options.name || this.id;
    this.required = options.required || false;
    this.disabled = options.disabled || false;
    this.onChange = options.onChange || null;
    this.element = null;
    this._selectEl = null;
    this._build();
  }

  _build() {
    this.element = createElement('div', { className: 'form-group' });

    if (this.label) {
      const labelEl = createElement('label', {
        for: this.id,
        className: 'form-label'
      }, [this.label]);
      this.element.appendChild(labelEl);
    }

    const selectOptions = this.options.map(opt => {
      const attrs = typeof opt === 'string' 
        ? { value: opt.toLowerCase().replace(/\s+/g, '-') }
        : { value: opt.value };
      const text = typeof opt === 'string' ? opt : opt.text;
      return createElement('option', attrs, [text]);
    });

    this._selectEl = createElement('select', {
      id: this.id,
      name: this.name,
      className: 'form-select',
      disabled: this.disabled,
      required: this.required,
      aria: { label: this.label }
    }, selectOptions);

    if (this.value) {
      this._selectEl.value = this.value;
    }

    if (this.onChange) {
      this._selectEl.addEventListener('change', (e) => {
        this.value = e.target.value;
        this.onChange(e.target.value, e);
      });
    }

    this.element.appendChild(this._selectEl);
  }

  getValue() {
    return this._selectEl.value;
  }

  setValue(value) {
    this.value = value;
    this._selectEl.value = value;
  }

  render(container) {
    container.appendChild(this.element);
    return this.element;
  }
}

export class Slider {
  constructor(options = {}) {
    this.label = options.label || '';
    this.min = options.min || 0;
    this.max = options.max || 100;
    this.step = options.step || 1;
    this.value = options.value || this.min;
    this.displayValue = options.displayValue !== undefined ? options.displayValue : this.value;
    this.id = options.id || `slider-${Date.now()}`;
    this.name = options.name || this.id;
    this.disabled = options.disabled || false;
    this.onChange = options.onChange || null;
    this.element = null;
    this._sliderEl = null;
    this._displayEl = null;
    this._build();
  }

  _build() {
    this.element = createElement('div', { className: 'form-group' });

    if (this.label) {
      this._displayEl = createElement('label', {
        for: this.id,
        className: 'form-label'
      }, [`${this.label}: `]);
      
      const valueSpan = createElement('span', {
        id: `${this.id}-value`,
        className: 'slider-value'
      }, [String(this.displayValue)]);
      
      this._displayEl.appendChild(valueSpan);
      this.element.appendChild(this._displayEl);
    }

    this._sliderEl = createElement('input', {
      type: 'range',
      id: this.id,
      name: this.name,
      className: 'form-slider',
      min: this.min,
      max: this.max,
      step: this.step,
      value: this.value,
      disabled: this.disabled,
      aria: {
        valuemin: this.min,
        valuemax: this.max,
        valuenow: this.value,
        valuetext: String(this.displayValue)
      }
    });

    if (this.onChange) {
      this._sliderEl.addEventListener('input', (e) => {
        this.value = parseInt(e.target.value, 10);
        this._updateDisplay();
        this.onChange(this.value, e);
      });
    }

    this.element.appendChild(this._sliderEl);
  }

  _updateDisplay() {
    if (this._displayEl) {
      const valueSpan = this._displayEl.querySelector('.slider-value');
      if (valueSpan) {
        valueSpan.textContent = String(this.displayValue);
      }
    }
    this._sliderEl.setAttribute('aria-valuenow', this.value);
    this._sliderEl.setAttribute('aria-valuetext', String(this.displayValue));
  }

  getValue() {
    return parseInt(this._sliderEl.value, 10);
  }

  setValue(value) {
    this.value = value;
    this._sliderEl.value = value;
    this._updateDisplay();
  }

  render(container) {
    container.appendChild(this.element);
    return this.element;
  }
}

export class Textarea {
  constructor(options = {}) {
    this.label = options.label || '';
    this.placeholder = options.placeholder || '';
    this.value = options.value || '';
    this.rows = options.rows || 4;
    this.id = options.id || `textarea-${Date.now()}`;
    this.name = options.name || this.id;
    this.required = options.required || false;
    this.disabled = options.disabled || false;
    this.onChange = options.onChange || null;
    this.element = null;
    this._textareaEl = null;
    this._build();
  }

  _build() {
    this.element = createElement('div', { className: 'form-group' });

    if (this.label) {
      const labelEl = createElement('label', {
        for: this.id,
        className: 'form-label'
      }, [this.label]);
      this.element.appendChild(labelEl);
    }

    this._textareaEl = createElement('textarea', {
      id: this.id,
      name: this.name,
      className: 'form-textarea',
      placeholder: this.placeholder,
      rows: this.rows,
      disabled: this.disabled,
      required: this.required
    }, [this.value]);

    if (this.onChange) {
      this._textareaEl.addEventListener('input', (e) => {
        this.value = e.target.value;
        this.onChange(e.target.value, e);
      });
    }

    this.element.appendChild(this._textareaEl);
  }

  getValue() {
    return this._textareaEl.value;
  }

  setValue(value) {
    this.value = value;
    this._textareaEl.value = value;
  }

  render(container) {
    container.appendChild(this.element);
    return this.element;
  }
}

export class ToggleGroup {
  constructor(options = {}) {
    this.label = options.label || '';
    this.options = options.options || [];
    this.value = options.value || (options.options?.[0]?.value || '');
    this.id = options.id || `toggle-${Date.now()}`;
    this.onChange = options.onChange || null;
    this.element = null;
    this._build();
  }

  _build() {
    this.element = createElement('div', { className: 'form-group' });

    if (this.label) {
      const labelEl = createElement('span', { className: 'form-label' }, [this.label]);
      this.element.appendChild(labelEl);
    }

    const groupEl = createElement('div', {
      className: 'toggle-group',
      role: 'radiogroup',
      id: this.id
    });

    this._buttons = this.options.map(opt => {
      const btn = createElement('button', {
        type: 'button',
        className: `toggle-btn ${opt.value === this.value ? 'active' : ''}`,
        'data-value': opt.value,
        role: 'radio',
        aria: {
          checked: opt.value === this.value ? 'true' : 'false'
        }
      }, [opt.label || opt.text || opt.value]);

      btn.addEventListener('click', () => {
        this.setValue(opt.value);
      });

      return btn;
    });

    groupEl.append(...this._buttons);
    this.element.appendChild(groupEl);
  }

  setValue(value) {
    this.value = value;
    this._buttons.forEach(btn => {
      const isActive = btn.dataset.value === value;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
    if (this.onChange) {
      this.onChange(value);
    }
  }

  getValue() {
    return this.value;
  }

  render(container) {
    container.appendChild(this.element);
    return this.element;
  }
}

export default { Input, Select, Slider, Textarea, ToggleGroup };

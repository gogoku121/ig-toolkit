// Content card component for displaying generated output
import { createElement, escapeHtml, generateId } from '../core/dom.js';
import { Button } from './Button.js';
import { Toast } from './Toast.js';

export class ContentCard {
  constructor(options = {}) {
    this.id = options.id || generateId('card');
    this.title = options.title || '';
    this.content = options.content || '';
    this.type = options.type || 'text'; // text, hashtag, reel, product, story, reply
    this.metadata = options.metadata || {};
    this.copyable = options.copyable !== false;
    this.favoritable = options.favoritable !== false;
    this.isFavorite = options.isFavorite || false;
    this.onCopy = options.onCopy || null;
    this.onFavorite = options.onFavorite || null;
    this.element = null;
    this._build();
  }

  _build() {
    this.element = createElement('div', {
      className: `output-card output-card-${this.type}`,
      id: this.id,
      role: 'article'
    });

    // Header
    const header = createElement('div', { className: 'output-card-header' });
    
    if (this.title) {
      const titleEl = createElement('span', {
        className: 'output-card-title'
      }, [this.title]);
      header.appendChild(titleEl);
    }

    // Action buttons container
    const actions = createElement('div', { className: 'output-card-actions' });

    if (this.favoritable) {
      this._favoriteBtn = createElement('button', {
        type: 'button',
        className: `action-btn favorite-btn ${this.isFavorite ? 'active' : ''}`,
        aria: {
          label: this.isFavorite ? 'Remove from favorites' : 'Add to favorites',
          pressed: this.isFavorite ? 'true' : 'false'
        }
      }, [
        createElement('svg', {
          viewBox: '0 0 24 24',
          fill: this.isFavorite ? 'currentColor' : 'none',
          stroke: 'currentColor',
          strokeWidth: '2'
        }, [])
      ]);
      
      this._favoriteBtn.querySelector('svg').innerHTML = '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>';
      
      this._favoriteBtn.addEventListener('click', () => this._handleFavorite());
      actions.appendChild(this._favoriteBtn);
    }

    if (this.copyable) {
      const copyBtn = new Button({
        text: 'Copy',
        variant: 'ghost',
        size: 'small',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
        onClick: () => this._handleCopy()
      });
      copyBtn.element.setAttribute('aria-label', 'Copy to clipboard');
      actions.appendChild(copyBtn.element);
    }

    header.appendChild(actions);
    this.element.appendChild(header);

    // Content
    this._contentEl = createElement('div', {
      className: 'output-card-content'
    });
    this._setContent(this.content);
    this.element.appendChild(this._contentEl);

    // Metadata
    if (Object.keys(this.metadata).length > 0) {
      const metaEl = createElement('div', { className: 'output-card-meta' });
      Object.entries(this.metadata).forEach(([key, value]) => {
        const metaItem = createElement('span', { className: 'meta-item' }, [`${key}: ${value}`]);
        metaEl.appendChild(metaItem);
      });
      this.element.appendChild(metaEl);
    }
  }

  _setContent(content) {
    if (this.type === 'hashtag') {
      // Render hashtags as clickable spans
      const hashtags = content.split(' ').filter(h => h.startsWith('#'));
      const nonHashtags = content.split(' ').filter(h => !h.startsWith('#'));
      
      this._contentEl.innerHTML = '';
      hashtags.forEach(tag => {
        const span = createElement('span', {
          className: 'hashtag',
          role: 'button',
          tabIndex: '0',
          title: 'Click to copy'
        }, [tag]);
        span.addEventListener('click', () => this._copyText(tag));
        span.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._copyText(tag);
          }
        });
        this._contentEl.appendChild(span);
        this._contentEl.appendChild(document.createTextNode(' '));
      });
      if (nonHashtags.length > 0) {
        this._contentEl.appendChild(document.createTextNode(nonHashtags.join(' ')));
      }
    } else {
      // Escape and render as text content
      this._contentEl.textContent = content;
    }
  }

  async _handleCopy() {
    await this._copyText(this.content);
    if (this.onCopy) {
      this.onCopy(this.content);
    }
  }

  async _copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      Toast.success('Copied to clipboard!');
    } catch (err) {
      Toast.error('Failed to copy');
    }
  }

  _handleFavorite() {
    this.isFavorite = !this.isFavorite;
    this._favoriteBtn?.classList.toggle('active', this.isFavorite);
    this._favoriteBtn?.setAttribute('aria-pressed', this.isFavorite ? 'true' : 'false');
    
    const svg = this._favoriteBtn?.querySelector('svg');
    if (svg) {
      svg.setAttribute('fill', this.isFavorite ? 'currentColor' : 'none');
    }

    if (this.onFavorite) {
      this.onFavorite(this.id, this.isFavorite);
    }
  }

  setContent(content) {
    this.content = content;
    this._setContent(content);
  }

  setTitle(title) {
    this.title = title;
    const titleEl = this.element.querySelector('.output-card-title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  render(container) {
    container.appendChild(this.element);
    return this.element;
  }

  destroy() {
    this.element.remove();
  }
}

export class LoadingCard {
  constructor(message = 'Generating...') {
    this.message = message;
    this.element = this._build();
  }

  _build() {
    return createElement('div', {
      className: 'output-card loading',
      aria: { label: this.message }
    }, [
      createElement('div', { className: 'loading-shimmer' }),
      createElement('span', { className: 'loading-text' }, [this.message])
    ]);
  }

  show(container) {
    container.appendChild(this.element);
    return this;
  }

  hide() {
    this.element.remove();
  }
}

export class ErrorCard {
  constructor(message = 'An error occurred') {
    this.message = message;
    this.element = this._build();
  }

  _build() {
    return createElement('div', {
      className: 'output-card error',
      role: 'alert'
    }, [
      createElement('svg', {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        className: 'error-icon'
      }, ['<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>']),
      createElement('p', { className: 'error-message' }, [this.message]),
      createElement('button', {
        type: 'button',
        className: 'btn btn-secondary',
        onclick: () => this.element.remove()
      }, ['Dismiss'])
    ]);
  }

  show(container) {
    container.appendChild(this.element);
    return this;
  }

  hide() {
    this.element.remove();
  }
}

export default { ContentCard, LoadingCard, ErrorCard };

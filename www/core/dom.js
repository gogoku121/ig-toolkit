// DOM utilities for safe and efficient DOM manipulation

// Escape HTML to prevent XSS
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Create element with attributes and children
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === 'aria') {
      Object.entries(value).forEach(([ariaKey, ariaValue]) => {
        element.setAttribute(`aria-${ariaKey}`, ariaValue);
      });
    } else if (value !== null && value !== undefined && value !== false) {
      element.setAttribute(key, value === true ? key : value);
    }
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  
  return element;
}

// Safe innerHTML setter with sanitization
export function safeInnerHTML(element, html) {
  if (!element) return;
  // First escape any script tags that might be in the HTML
  const sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, 'data-safe-');
  element.innerHTML = sanitized;
}

// Query selector with error handling
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

// Query selector all
export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

// Debounce function
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle function
export function throttle(fn, limit = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Animate element
export function animate(element, keyframes, options = {}) {
  const {
    duration = 300,
    easing = 'ease-out',
    fill = 'forwards'
  } = options;
  
  return element.animate(keyframes, { duration, easing, fill });
}

// Fade in animation
export function fadeIn(element, duration = 300) {
  element.style.opacity = '0';
  element.style.display = element.tagName === 'SPAN' ? 'inline-block' : 'block';
  
  requestAnimationFrame(() => {
    element.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], { duration, easing: 'ease-out', fill: 'forwards' });
  });
}

// Fade out animation
export function fadeOut(element, duration = 300) {
  return new Promise(resolve => {
    element.animate([
      { opacity: 1 },
      { opacity: 0 }
    ], { duration, easing: 'ease-out', fill: 'forwards' }).onfinish = () => {
      element.style.display = 'none';
      resolve();
    };
  });
}

// Slide toggle
export function slideToggle(element, duration = 300) {
  if (element.style.display === 'none') {
    element.style.display = getComputedStyle(element).display;
    const height = element.offsetHeight;
    element.style.height = '0';
    element.style.overflow = 'hidden';
    
    requestAnimationFrame(() => {
      element.animate([
        { height: '0' },
        { height: `${height}px` }
      ], { duration, easing: 'ease-out', fill: 'forwards' }).onfinish = () => {
        element.style.height = '';
        element.style.overflow = '';
      };
    });
  } else {
    const height = element.offsetHeight;
    element.style.height = `${height}px`;
    element.style.overflow = 'hidden';
    
    requestAnimationFrame(() => {
      element.animate([
        { height: `${height}px` },
        { height: '0' }
      ], { duration, easing: 'ease-out', fill: 'forwards' }).onfinish = () => {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
      };
    });
  }
}

// Focus trap for modals
export function createFocusTrap(container) {
  const focusableSelector = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');
  
  const focusableElements = container.querySelectorAll(focusableSelector);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }
  
  container.addEventListener('keydown', handleKeyDown);
  firstElement?.focus();
  
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

// Generate unique ID
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export default {
  escapeHtml,
  createElement,
  safeInnerHTML,
  $,
  $$,
  debounce,
  throttle,
  animate,
  fadeIn,
  fadeOut,
  slideToggle,
  createFocusTrap,
  generateId
};

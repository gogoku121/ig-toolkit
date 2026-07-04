// Event bus for decoupled component communication
export class EventBus {
  constructor() {
    this._events = new Map();
    this._onceEvents = new Map();
  }

  // Subscribe to an event
  on(event, callback, context = null) {
    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    const handler = context ? callback.bind(context) : callback;
    this._events.get(event).push(handler);
    return () => this.off(event, callback);
  }

  // Subscribe once
  once(event, callback, context = null) {
    if (!this._onceEvents.has(event)) {
      this._onceEvents.set(event, []);
    }
    const handler = context ? callback.bind(context) : callback;
    this._onceEvents.get(event).push(handler);
  }

  // Unsubscribe from event
  off(event, callback) {
    if (!this._events.has(event)) return;
    const handlers = this._events.get(event);
    const index = handlers.indexOf(callback);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  // Emit event with data
  emit(event, data = null) {
    // Regular handlers
    if (this._events.has(event)) {
      this._events.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (e) {
          console.error(`Event handler error in "${event}":`, e);
        }
      });
    }

    // Once handlers
    if (this._onceEvents.has(event)) {
      this._onceEvents.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (e) {
          console.error(`Once handler error in "${event}":`, e);
        }
      });
      this._onceEvents.delete(event);
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event = null) {
    if (event) {
      this._events.delete(event);
      this._onceEvents.delete(event);
    } else {
      this._events.clear();
      this._onceEvents.clear();
    }
  }
}

// Global event bus instance
export const eventBus = new EventBus();

// Event names as constants for consistency
export const Events = {
  // Tool events
  TOOL_CHANGE: 'tool:change',
  TOOL_RESET: 'tool:reset',
  
  // Generation events
  GENERATE_START: 'generate:start',
  GENERATE_COMPLETE: 'generate:complete',
  GENERATE_ERROR: 'generate:error',
  
  // UI events
  THEME_CHANGE: 'theme:change',
  SIDEBAR_TOGGLE: 'sidebar:toggle',
  HELP_SHOW: 'help:show',
  HELP_HIDE: 'help:hide',
  
  // Content events
  CONTENT_COPY: 'content:copy',
  CONTENT_SAVE: 'content:save',
  CONTENT_FAVORITE: 'content:favorite',
  
  // History events
  HISTORY_ADD: 'history:add',
  HISTORY_CLEAR: 'history:clear',
  
  // Keyboard shortcut
  SHORTCUT_TRIGGERED: 'shortcut:triggered'
};

export default eventBus;

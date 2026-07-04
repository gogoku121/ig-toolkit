// Simple reactive state management with Proxy
export class Store {
  constructor(initialState = {}) {
    this._state = initialState;
    this._listeners = new Map();
    this._proxy = null;
    this._proxy = this._createProxy();
  }

  _createProxy() {
    return new Proxy(this._state, {
      set: (target, key, value) => {
        const oldValue = target[key];
        target[key] = value;
        this._notify(key, value, oldValue);
        return true;
      },
      get: (target, key) => {
        if (typeof target[key] === 'object' && target[key] !== null) {
          return new Proxy(target[key], {
            get: (t, k) => t[k],
            set: (t, k, v) => {
              t[k] = v;
              this._notify(`${key}.${k}`, v, t[k]);
              return true;
            }
          });
        }
        return target[key];
      }
    });
  }

  get state() {
    return this._proxy;
  }

  get(key) {
    return this._state[key];
  }

  set(key, value) {
    this._state[key] = value;
  }

  update(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      this._state[key] = value;
    });
  }

  subscribe(key, callback) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Set());
    }
    this._listeners.get(key).add(callback);
    return () => this._listeners.get(key)?.delete(callback);
  }

  _notify(key, newValue, oldValue) {
    this._listeners.get(key)?.forEach(cb => cb(newValue, oldValue));
    this._listeners.get('*')?.forEach(cb => cb(key, newValue, oldValue));
  }
}

// Global application state
export const AppState = new Store({
  // Current tool
  activeTool: 'captions',
  
  // Theme
  theme: 'dark',
  
  // Loading states
  isLoading: false,
  loadingMessage: '',
  
  // Error state
  error: null,
  
  // Generated content
  generatedContent: null,
  
  // History
  history: [],
  historyIndex: -1,
  
  // User preferences
  preferences: {
    tone: 'casual',
    length: 'medium',
    hashtagCount: 15
  },
  
  // UI state
  sidebarCollapsed: false,
  helpVisible: false
});

export default AppState;

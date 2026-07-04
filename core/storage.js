// Safe localStorage wrapper with error handling and JSON serialization
import Config from './config.js';

export const Storage = {
  _isAvailable: null,

  // Check if localStorage is available
  isAvailable() {
    if (this._isAvailable !== null) return this._isAvailable;
    try {
      const test = '__storage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      this._isAvailable = true;
    } catch (e) {
      this._isAvailable = false;
      console.warn('localStorage not available:', e.message);
    }
    return this._isAvailable;
  },

  // Safe get with default value
  get(key, defaultValue = null) {
    if (!this.isAvailable()) return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`Storage.get error for "${key}":`, e.message);
      return defaultValue;
    }
  },

  // Safe set with error handling
  set(key, value) {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      // Handle quota exceeded
      if (e.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded, clearing old data...');
        this._clearOldEntries(key);
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (e2) {
          console.error('Failed to save even after clearing:', e2.message);
        }
      }
      console.error(`Storage.set error for "${key}":`, e.message);
      return false;
    }
  },

  // Remove specific key
  remove(key) {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`Storage.remove error for "${key}":`, e.message);
      return false;
    }
  },

  // Clear all app-related entries
  clear() {
    if (!this.isAvailable()) return false;
    try {
      Object.values(Config.storage).forEach(key => {
        window.localStorage.removeItem(key);
      });
      return true;
    } catch (e) {
      console.error('Storage.clear error:', e.message);
      return false;
    }
  },

  // Clear oldest entries when quota exceeded
  _clearOldEntries(currentKey) {
    const appKeys = Object.values(Config.storage);
    const entries = [];
    
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (appKeys.includes(key) && key !== currentKey) {
        const value = window.localStorage.getItem(key);
        const lastModified = this._getLastModified(key);
        entries.push({ key, value, lastModified });
      }
    }
    
    // Sort by last modified (oldest first) and remove half
    entries.sort((a, b) => a.lastModified - b.lastModified);
    const toRemove = entries.slice(0, Math.ceil(entries.length / 2));
    toRemove.forEach(entry => window.localStorage.removeItem(entry.key));
  },

  _getLastModified(key) {
    try {
      const data = this.get(`${key}_meta`, { modified: Date.now() });
      return data.modified || Date.now();
    } catch {
      return Date.now();
    }
  },

  // Save with timestamp for cleanup tracking
  saveWithTimestamp(key, value) {
    this.set(key, value);
    this.set(`${key}_meta`, { modified: Date.now() });
  }
};

// User preferences management
export const PreferencesStorage = {
  KEY: Config.storage.preferences,

  load() {
    return Storage.get(this.KEY, Config.defaults);
  },

  save(prefs) {
    Storage.saveWithTimestamp(this.KEY, prefs);
  },

  update(updates) {
    const current = this.load();
    this.save({ ...current, ...updates });
  },

  get(key) {
    return this.load()[key];
  },

  set(key, value) {
    this.update({ [key]: value });
  }
};

// History management with size limit
export const HistoryStorage = {
  KEY: Config.storage.history,
  MAX_ENTRIES: 50,

  load() {
    return Storage.get(this.KEY, []);
  },

  add(entry) {
    const history = this.load();
    history.unshift({
      id: Date.now().toString(36),
      timestamp: Date.now(),
      ...entry
    });
    // Limit size
    if (history.length > this.MAX_ENTRIES) {
      history.pop();
    }
    Storage.saveWithTimestamp(this.KEY, history);
    return history;
  },

  clear() {
    Storage.remove(this.KEY);
    return [];
  },

  getById(id) {
    return this.load().find(item => item.id === id);
  },

  remove(id) {
    const history = this.load().filter(item => item.id !== id);
    Storage.set(this.KEY, history);
    return history;
  }
};

// Favorites management
export const FavoritesStorage = {
  KEY: Config.storage.favorites,

  load() {
    return Storage.get(this.KEY, []);
  },

  add(item) {
    const favorites = this.load();
    if (favorites.some(f => f.id === item.id)) return favorites;
    favorites.unshift({ ...item, favoritedAt: Date.now() });
    Storage.saveWithTimestamp(this.KEY, favorites);
    return favorites;
  },

  remove(id) {
    const favorites = this.load().filter(f => f.id !== id);
    Storage.set(this.KEY, favorites);
    return favorites;
  },

  isFavorite(id) {
    return this.load().some(f => f.id === id);
  },

  toggle(item) {
    if (this.isFavorite(item.id)) {
      this.remove(item.id);
      return false;
    }
    this.add(item);
    return true;
  }
};

export default { Storage, PreferencesStorage, HistoryStorage, FavoritesStorage };

/**
 * PersistentMemory
 * Memory system using IndexedDB (preferred) with localStorage fallback
 * Stores all generation data, user preferences, and learning signals
 */

const DB_NAME = 'IGToolkitMemory';
const DB_VERSION = 1;
const STORES = {
  generations: 'generations',
  hooks: 'hooks',
  ctas: 'ctas',
  topics: 'topics',
  preferences: 'preferences',
  favorites: 'favorites',
  signals: 'signals',
  sessionHistory: 'sessionHistory'
};

const MAX_RECORDS = {
  generations: 500,
  hooks: 200,
  ctas: 200,
  topics: 300,
  favorites: 100,
  sessionHistory: 100
};

/**
 * PersistentMemory
 * Manages all persistent storage with IndexedDB
 */
export class PersistentMemory {
  constructor() {
    this.db = null;
    this.useIndexedDB = false;
    this._initPromise = this._init();
  }

  async _init() {
    if (typeof indexedDB !== 'undefined') {
      try {
        this.db = await this._openIndexedDB();
        this.useIndexedDB = true;
        console.log('PersistentMemory: Using IndexedDB');
        return;
      } catch (e) {
        console.warn('IndexedDB unavailable, falling back to localStorage:', e);
      }
    }
    
    this.useIndexedDB = false;
    console.log('PersistentMemory: Using localStorage');
  }

  async _openIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores with indexes
        if (!db.objectStoreNames.contains(STORES.generations)) {
          const genStore = db.createObjectStore(STORES.generations, { keyPath: 'id', autoIncrement: true });
          genStore.createIndex('topic', 'topic', { unique: false });
          genStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains(STORES.hooks)) {
          const hookStore = db.createObjectStore(STORES.hooks, { keyPath: 'id', autoIncrement: true });
          hookStore.createIndex('text', 'text', { unique: false });
          hookStore.createIndex('uses', 'uses', { unique: false });
        }
        
        if (!db.objectStoreNames.contains(STORES.ctas)) {
          const ctaStore = db.createObjectStore(STORES.ctas, { keyPath: 'id', autoIncrement: true });
          ctaStore.createIndex('text', 'text', { unique: false });
        }
        
        if (!db.objectStoreNames.contains(STORES.topics)) {
          const topicStore = db.createObjectStore(STORES.topics, { keyPath: 'id', autoIncrement: true });
          topicStore.createIndex('topic', 'topic', { unique: false });
          topicStore.createIndex('category', 'category', { unique: false });
        }
        
        if (!db.objectStoreNames.contains(STORES.preferences)) {
          db.createObjectStore(STORES.preferences, { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains(STORES.favorites)) {
          const favStore = db.createObjectStore(STORES.favorites, { keyPath: 'id', autoIncrement: true });
          favStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains(STORES.signals)) {
          const signalStore = db.createObjectStore(STORES.signals, { keyPath: 'id', autoIncrement: true });
          signalStore.createIndex('type', 'type', { unique: false });
          signalStore.createIndex('contentId', 'contentId', { unique: false });
        }
        
        if (!db.objectStoreNames.contains(STORES.sessionHistory)) {
          const sessionStore = db.createObjectStore(STORES.sessionHistory, { keyPath: 'id', autoIncrement: true });
          sessionStore.createIndex('sessionId', 'sessionId', { unique: false });
          sessionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async _ensureReady() {
    await this._initPromise;
  }

  // ==================== GENERATIONS ====================

  async addGeneration(data) {
    await this._ensureReady();
    
    const record = {
      topic: data.topic,
      content: data.content,
      personality: data.personality,
      goal: data.goal,
      audience: data.audience,
      strategy: data.strategy,
      category: data.category,
      score: data.score || 75,
      timestamp: Date.now()
    };

    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.generations, 'readwrite');
        const store = tx.objectStore(STORES.generations);
        const request = store.add(record);
        request.onsuccess = () => {
          this._pruneStore(STORES.generations, MAX_RECORDS.generations);
          resolve(request.result);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const generations = this._getLocal('generations') || [];
      record.id = Date.now();
      generations.unshift(record);
      if (generations.length > MAX_RECORDS.generations) {
        generations.splice(MAX_RECORDS.generations);
      }
      this._setLocal('generations', generations);
      return record.id;
    }
  }

  async getRecentGenerations(limit = 20) {
    await this._ensureReady();
    
    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.generations, 'readonly');
        const store = tx.objectStore(STORES.generations);
        const index = store.index('timestamp');
        const request = index.openCursor(null, 'prev');
        const results = [];
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor && results.length < limit) {
            results.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const generations = this._getLocal('generations') || [];
      return generations.slice(0, limit);
    }
  }

  async getGenerationsByTopic(topic, limit = 10) {
    await this._ensureReady();
    const all = await this.getRecentGenerations(500);
    const normalizedTopic = topic.toLowerCase();
    
    return all.filter(g => 
      g.topic?.toLowerCase().includes(normalizedTopic)
    ).slice(0, limit);
  }

  // ==================== HOOKS ====================

  async addHook(text, metadata = {}) {
    await this._ensureReady();
    
    const record = {
      text: text.substring(0, 200),
      uses: 1,
      personality: metadata.personality,
      topic: metadata.topic,
      timestamp: Date.now()
    };

    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.hooks, 'readwrite');
        const store = tx.objectStore(STORES.hooks);
        const request = store.add(record);
        request.onsuccess = () => {
          this._pruneStore(STORES.hooks, MAX_RECORDS.hooks);
          resolve(request.result);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const hooks = this._getLocal('hooks') || [];
      record.id = Date.now();
      hooks.unshift(record);
      if (hooks.length > MAX_RECORDS.hooks) {
        hooks.splice(MAX_RECORDS.hooks);
      }
      this._setLocal('hooks', hooks);
      return record.id;
    }
  }

  async getRecentHooks(limit = 20) {
    await this._ensureReady();
    
    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.hooks, 'readonly');
        const store = tx.objectStore(STORES.hooks);
        const index = store.index('timestamp');
        const request = index.openCursor(null, 'prev');
        const results = [];
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor && results.length < limit) {
            results.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const hooks = this._getLocal('hooks') || [];
      return hooks.slice(0, limit);
    }
  }

  async getUsedHooks(limit = 50) {
    const hooks = await this.getRecentHooks(500);
    return hooks.slice(0, limit).map(h => h.text);
  }

  // ==================== CTAs ====================

  async addCTA(text, metadata = {}) {
    await this._ensureReady();
    
    const record = {
      text: text.substring(0, 200),
      uses: 1,
      goal: metadata.goal,
      topic: metadata.topic,
      timestamp: Date.now()
    };

    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.ctas, 'readwrite');
        const store = tx.objectStore(STORES.ctas);
        const request = store.add(record);
        request.onsuccess = () => {
          this._pruneStore(STORES.ctas, MAX_RECORDS.ctas);
          resolve(request.result);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const ctas = this._getLocal('ctas') || [];
      record.id = Date.now();
      ctas.unshift(record);
      if (ctas.length > MAX_RECORDS.ctas) {
        ctas.splice(MAX_RECORDS.ctas);
      }
      this._setLocal('ctas', ctas);
      return record.id;
    }
  }

  async getRecentCTAs(limit = 20) {
    await this._ensureReady();
    
    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.ctas, 'readonly');
        const store = tx.objectStore(STORES.ctas);
        const index = store.index('timestamp');
        const request = index.openCursor(null, 'prev');
        const results = [];
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor && results.length < limit) {
            results.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const ctas = this._getLocal('ctas') || [];
      return ctas.slice(0, limit);
    }
  }

  async getUsedCTAs(limit = 50) {
    const ctas = await this.getRecentCTAs(500);
    return ctas.slice(0, limit).map(c => c.text);
  }

  // ==================== TOPICS ====================

  async addTopic(topic, category = null) {
    await this._ensureReady();
    
    const record = {
      topic: topic.toLowerCase(),
      category,
      count: 1,
      lastSeen: Date.now()
    };

    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.topics, 'readwrite');
        const store = tx.objectStore(STORES.topics);
        const index = store.index('topic');
        const getRequest = index.get(record.topic);
        
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            record.id = getRequest.result.id;
            record.count = getRequest.result.count + 1;
            store.put(record);
          } else {
            store.add(record);
          }
          this._pruneStore(STORES.topics, MAX_RECORDS.topics);
          resolve(record);
        };
        getRequest.onerror = () => reject(getRequest.error);
      });
    } else {
      const topics = this._getLocal('topics') || [];
      const existing = topics.find(t => t.topic === record.topic);
      
      if (existing) {
        existing.count++;
        existing.lastSeen = Date.now();
      } else {
        record.id = Date.now();
        topics.unshift(record);
      }
      
      if (topics.length > MAX_RECORDS.topics) {
        topics.splice(MAX_RECORDS.topics);
      }
      this._setLocal('topics', topics);
      return record;
    }
  }

  async getFrequentTopics(limit = 20) {
    await this._ensureReady();
    
    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.topics, 'readonly');
        const store = tx.objectStore(STORES.topics);
        const request = store.getAll();
        
        request.onsuccess = () => {
          const sorted = request.result
            .sort((a, b) => (b.count || 0) - (a.count || 0))
            .slice(0, limit);
          resolve(sorted);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const topics = this._getLocal('topics') || [];
      return topics.sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, limit);
    }
  }

  // ==================== PREFERENCES ====================

  async setPreference(key, value) {
    await this._ensureReady();
    
    const record = { key, value, updatedAt: Date.now() };

    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.preferences, 'readwrite');
        const store = tx.objectStore(STORES.preferences);
        const request = store.put(record);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      const prefs = this._getLocal('preferences') || {};
      prefs[key] = { value, updatedAt: Date.now() };
      this._setLocal('preferences', prefs);
    }
  }

  async getPreference(key, defaultValue = null) {
    await this._ensureReady();
    
    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.preferences, 'readonly');
        const store = tx.objectStore(STORES.preferences);
        const request = store.get(key);
        
        request.onsuccess = () => {
          resolve(request.result?.value ?? defaultValue);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const prefs = this._getLocal('preferences') || {};
      return prefs[key]?.value ?? defaultValue;
    }
  }

  async getAllPreferences() {
    await this._ensureReady();
    
    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.preferences, 'readonly');
        const store = tx.objectStore(STORES.preferences);
        const request = store.getAll();
        
        request.onsuccess = () => {
          const prefs = {};
          request.result.forEach(r => { prefs[r.key] = r.value; });
          resolve(prefs);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const prefs = this._getLocal('preferences') || {};
      const result = {};
      Object.keys(prefs).forEach(k => { result[k] = prefs[k].value; });
      return result;
    }
  }

  // ==================== FAVORITES ====================

  async addFavorite(data) {
    await this._ensureReady();
    
    const record = {
      content: data.content,
      topic: data.topic,
      personality: data.personality,
      goal: data.goal,
      timestamp: Date.now()
    };

    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.favorites, 'readwrite');
        const store = tx.objectStore(STORES.favorites);
        const request = store.add(record);
        request.onsuccess = () => {
          this._pruneStore(STORES.favorites, MAX_RECORDS.favorites);
          resolve(request.result);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const favorites = this._getLocal('favorites') || [];
      record.id = Date.now();
      favorites.unshift(record);
      if (favorites.length > MAX_RECORDS.favorites) {
        favorites.splice(MAX_RECORDS.favorites);
      }
      this._setLocal('favorites', favorites);
      return record.id;
    }
  }

  async getFavorites(limit = 20) {
    await this._ensureReady();
    
    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.favorites, 'readonly');
        const store = tx.objectStore(STORES.favorites);
        const index = store.index('timestamp');
        const request = index.openCursor(null, 'prev');
        const results = [];
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor && results.length < limit) {
            results.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const favorites = this._getLocal('favorites') || [];
      return favorites.slice(0, limit);
    }
  }

  // ==================== SIGNALS (Learning) ====================

  async addSignal(type, contentId, metadata = {}) {
    await this._ensureReady();
    
    const record = {
      type, // 'copy', 'save', 'favorite', 'export', 'dismiss'
      contentId,
      metadata,
      timestamp: Date.now()
    };

    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.signals, 'readwrite');
        const store = tx.objectStore(STORES.signals);
        const request = store.add(record);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } else {
      const signals = this._getLocal('signals') || [];
      record.id = Date.now();
      signals.unshift(record);
      if (signals.length > 1000) {
        signals.splice(1000);
      }
      this._setLocal('signals', signals);
      return record.id;
    }
  }

  async getSignalsByType(type, limit = 100) {
    await this._ensureReady();
    
    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.signals, 'readonly');
        const store = tx.objectStore(STORES.signals);
        const index = store.index('type');
        const request = index.openCursor(null, 'prev');
        const results = [];
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor && results.length < limit) {
            if (cursor.value.type === type) {
              results.push(cursor.value);
            }
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const signals = this._getLocal('signals') || [];
      return signals.filter(s => s.type === type).slice(0, limit);
    }
  }

  async getSignalStats() {
    await this._ensureReady();
    
    const signals = this._getLocal('signals') || [];
    const stats = {
      copy: 0,
      save: 0,
      favorite: 0,
      export: 0,
      dismiss: 0,
      total: signals.length
    };

    signals.forEach(s => {
      if (stats.hasOwnProperty(s.type)) {
        stats[s.type]++;
      }
    });

    return stats;
  }

  // ==================== SESSION HISTORY ====================

  async addSessionEntry(sessionId, data) {
    await this._ensureReady();
    
    const record = {
      sessionId,
      topic: data.topic,
      personality: data.personality,
      goal: data.goal,
      count: 1,
      timestamp: Date.now()
    };

    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.sessionHistory, 'readwrite');
        const store = tx.objectStore(STORES.sessionHistory);
        const index = store.index('sessionId');
        const getRequest = index.get(sessionId);
        
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            record.id = getRequest.result.id;
            record.count = getRequest.result.count + 1;
            store.put(record);
          } else {
            store.add(record);
          }
          this._pruneStore(STORES.sessionHistory, MAX_RECORDS.sessionHistory);
          resolve(record);
        };
        getRequest.onerror = () => reject(getRequest.error);
      });
    } else {
      const history = this._getLocal('sessionHistory') || [];
      const existing = history.find(h => h.sessionId === sessionId);
      
      if (existing) {
        existing.count++;
        existing.lastSeen = Date.now();
      } else {
        record.id = Date.now();
        history.unshift(record);
      }
      
      if (history.length > MAX_RECORDS.sessionHistory) {
        history.splice(MAX_RECORDS.sessionHistory);
      }
      this._setLocal('sessionHistory', history);
      return record;
    }
  }

  async getSessionCount(sessionId) {
    await this._ensureReady();
    
    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORES.sessionHistory, 'readonly');
        const store = tx.objectStore(STORES.sessionHistory);
        const index = store.index('sessionId');
        const request = index.get(sessionId);
        
        request.onsuccess = () => {
          resolve(request.result?.count || 0);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const history = this._getLocal('sessionHistory') || [];
      const entry = history.find(h => h.sessionId === sessionId);
      return entry?.count || 0;
    }
  }

  // ==================== UTILITIES ====================

  async _pruneStore(storeName, maxRecords) {
    if (!this.useIndexedDB) return;
    
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const index = store.index('timestamp');
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        if (countRequest.result > maxRecords) {
          const deleteCount = countRequest.result - maxRecords;
          const cursorRequest = index.openCursor();
          
          cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor && deleteCount > 0) {
              cursor.delete();
              cursor.continue();
            }
          };
        }
        resolve();
      };
      countRequest.onerror = () => reject(countRequest.error);
    });
  }

  _getLocal(key) {
    try {
      const data = localStorage.getItem(`ig-toolkit-${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Error reading localStorage key ${key}:`, e);
      return null;
    }
  }

  _setLocal(key, value) {
    try {
      localStorage.setItem(`ig-toolkit-${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing localStorage key ${key}:`, e);
    }
  }

  async clearAll() {
    await this._ensureReady();
    
    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(Object.values(STORES), 'readwrite');
        let completed = 0;
        
        Object.values(STORES).forEach(storeName => {
          const store = tx.objectStore(storeName);
          const request = store.clear();
          request.onsuccess = () => {
            completed++;
            if (completed === Object.values(STORES).length) {
              resolve();
            }
          };
          request.onerror = () => reject(request.error);
        });
      });
    } else {
      Object.values(STORES).forEach(key => {
        localStorage.removeItem(`ig-toolkit-${key}`);
      });
    }
  }

  async getStats() {
    await this._ensureReady();
    
    const stats = {
      generations: 0,
      hooks: 0,
      ctas: 0,
      topics: 0,
      favorites: 0,
      signals: 0,
      sessionHistory: 0
    };

    if (this.useIndexedDB) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(Object.values(STORES), 'readonly');
        let completed = 0;
        
        Object.values(STORES).forEach(storeName => {
          const store = tx.objectStore(storeName);
          const request = store.count();
          
          request.onsuccess = () => {
            const key = storeName.replace(/s$/, ''); // Remove trailing 's'
            if (stats.hasOwnProperty(key)) {
              stats[key] = request.result;
            } else if (stats.hasOwnProperty(storeName)) {
              stats[storeName] = request.result;
            }
            completed++;
            if (completed === Object.values(STORES).length) {
              resolve(stats);
            }
          };
          request.onerror = () => reject(request.error);
        });
      });
    } else {
      stats.generations = (this._getLocal('generations') || []).length;
      stats.hooks = (this._getLocal('hooks') || []).length;
      stats.ctas = (this._getLocal('ctas') || []).length;
      stats.topics = (this._getLocal('topics') || []).length;
      stats.favorites = (this._getLocal('favorites') || []).length;
      stats.signals = (this._getLocal('signals') || []).length;
      stats.sessionHistory = (this._getLocal('sessionHistory') || []).length;
      return stats;
    }
  }
}

export default PersistentMemory;

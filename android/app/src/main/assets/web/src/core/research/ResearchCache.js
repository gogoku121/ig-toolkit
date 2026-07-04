/**
 * ResearchCache
 * Caches research results with IndexedDB
 */

const DB_NAME = 'IGToolkitResearch';
const STORE_NAME = 'research';

export class ResearchCache {
  constructor() {
    this.db = null;
    this.ready = this._init();
  }

  async _init() {
    if (typeof indexedDB === 'undefined') return;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'topic' });
        }
      };
    });
  }

  async ensure() {
    await this.ready;
  }

  async get(topic) {
    await this.ensure();
    if (!this.db) return null;
    
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(topic.toLowerCase());
      
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async set(topic, data) {
    await this.ensure();
    if (!this.db) return;
    
    const record = {
      topic: topic.toLowerCase(),
      data,
      timestamp: Date.now(),
      expires: Date.now() + (data.ttl || 3600000) // 1 hour default
    };
    
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async delete(topic) {
    await this.ensure();
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(topic.toLowerCase());
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async clear() {
    await this.ensure();
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async isExpired(topic) {
    const record = await this.get(topic);
    if (!record) return true;
    return Date.now() > record.expires;
  }

  async getAll() {
    await this.ensure();
    if (!this.db) return [];
    
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }
}

export default ResearchCache;

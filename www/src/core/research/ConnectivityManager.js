/**
 * ConnectivityManager
 * Monitors connectivity state
 */

export class ConnectivityManager {
  constructor() {
    this.state = navigator.onLine ? 'ONLINE' : 'OFFLINE';
    this.listeners = [];
    this._setupListeners();
  }

  _setupListeners() {
    window.addEventListener('online', () => this._setState('ONLINE'));
    window.addEventListener('offline', () => this._setState('OFFLINE'));
  }

  _setState(state) {
    if (this.state !== state) {
      this.state = state;
      this.listeners.forEach(fn => fn(state));
    }
  }

  getState() {
    return this.state;
  }

  isOnline() {
    return this.state === 'ONLINE';
  }

  isOffline() {
    return this.state === 'OFFLINE';
  }

  onStateChange(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  async check() {
    try {
      const resp = await fetch('https://www.google.com/favicon.ico', { 
        mode: 'no-cors',
        cache: 'no-store' 
      });
      this._setState('ONLINE');
      return true;
    } catch {
      this._setState('OFFLINE');
      return false;
    }
  }
}

export default ConnectivityManager;

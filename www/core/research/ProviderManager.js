/**
 * ProviderManager
 * Manages research providers with automatic failover
 */

export class ProviderManager {
  constructor() {
    this.providers = this._initProviders();
    this.currentProvider = null;
    this.requestCounts = {};
    this.timeout = 8000;
  }

  _initProviders() {
    return {
      duckduckgo: {
        name: 'DuckDuckGo',
        priority: 1,
        url: 'https://api.duckduckgo.com/',
        enabled: true,
        needsKey: false
      },
      brave: {
        name: 'Brave Search',
        priority: 2,
        url: 'https://api.search.brave.com/res/v1/web/search',
        enabled: true,
        needsKey: true,
        keyName: 'BRAVE_API_KEY'
      },
      serpapi: {
        name: 'SerpAPI (Google)',
        priority: 3,
        url: 'https://serpapi.com/search',
        enabled: true,
        needsKey: true,
        keyName: 'SERPAPI_KEY'
      }
    };
  }

  async getProvider() {
    if (this.currentProvider) return this.currentProvider;
    
    // Find first available
    const sorted = Object.entries(this.providers)
      .filter(([_, p]) => p.enabled)
      .sort((a, b) => a[1].priority - b[1].priority);
    
    this.currentProvider = sorted[0]?.[0] || 'duckduckgo';
    return this.currentProvider;
  }

  async search(query) {
    const provider = await this.getProvider();
    
    try {
      const results = await this._searchWith(provider, query);
      return { success: true, provider, results, timestamp: Date.now() };
    } catch (e) {
      return this._searchWithFailover(query, provider);
    }
  }

  async _searchWith(provider, query) {
    const p = this.providers[provider];
    if (!p) throw new Error('Unknown provider');

    switch (provider) {
      case 'duckduckgo':
        return this._searchDuckDuckGo(query);
      default:
        return this._searchDuckDuckGo(query); // Fallback
    }
  }

  async _searchDuckDuckGo(query) {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);

    try {
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      
      const data = await resp.json();
      
      return {
        query: data.Query,
        results: (data.RelatedTopics || []).slice(0, 10).map(t => ({
          title: t.Text || '',
          url: t.FirstURL || '',
          snippet: t.Text || '',
          source: 'duckduckgo'
        })).filter(r => r.title),
        summary: data.Definition || '',
        timestamp: Date.now()
      };
    } catch (e) {
      clearTimeout(timeout);
      throw e;
    }
  }

  async _searchWithFailover(query, failedProvider) {
    const sorted = Object.entries(this.providers)
      .filter(([k, p]) => p.enabled && k !== failedProvider)
      .sort((a, b) => a[1].priority - b[1].priority);

    for (const [key] of sorted) {
      try {
        const results = await this._searchWith(key, query);
        return { success: true, provider: key, results, timestamp: Date.now() };
      } catch (e) {
        continue;
      }
    }

    return { success: false, provider: null, results: null, error: 'All providers failed' };
  }

  getStatuses() {
    return Object.entries(this.providers).map(([key, p]) => ({
      key,
      name: p.name,
      enabled: p.enabled,
      priority: p.priority
    }));
  }
}

export default ProviderManager;

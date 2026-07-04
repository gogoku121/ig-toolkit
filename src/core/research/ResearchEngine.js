/**
 * ResearchEngine
 * Main research orchestrator with internet-first approach
 */

import { ProviderManager } from './ProviderManager.js';
import { ResearchCache } from './ResearchCache.js';
import { ConnectivityManager } from './ConnectivityManager.js';
import { SupremeGenerator } from '../intelligence/SupremeGenerator.js';

export class ResearchEngine {
  constructor() {
    this.provider = new ProviderManager();
    this.cache = new ResearchCache();
    this.connectivity = new ConnectivityManager();
    this.generator = new SupremeGenerator();
    
    this.mode = 'internet_first'; // internet_first, hybrid, offline_only
    this.status = 'READY';
    this.currentResearch = null;
  }

  /**
   * Research topic and generate caption
   */
  async researchAndGenerate(options = {}) {
    const { topic, personality, goal, audience, versions } = options;
    
    this._setStatus('RESEARCHING');
    
    // Get research data
    const research = await this._getResearch(topic);
    
    this._setStatus('ANALYZING');
    
    // Extract insights from research
    const insights = this._extractInsights(research);
    
    this._setStatus('THINKING');
    
    // Generate with research context
    const results = this.generator.generateMultiple({
      versions: versions || 3,
      topic,
      personality,
      goal,
      audience,
      researchContext: insights
    });
    
    this._setStatus('DONE');
    
    return {
      research,
      insights,
      results,
      mode: this.connectivity.getState(),
      provider: this.provider.currentProvider
    };
  }

  /**
   * Get research data (cache or internet)
   */
  async _getResearch(topic) {
    // Check cache first
    const cached = await this.cache.get(topic);
    
    if (cached && !await this.cache.isExpired(topic)) {
      this._setStatus('CACHE MODE');
      return cached;
    }
    
    // Check if online
    if (!this.connectivity.isOnline()) {
      this._setStatus('OFFLINE MODE');
      return cached || this._getOfflineResearch(topic);
    }
    
    // Do internet research
    try {
      const searchResult = await this.provider.search(topic);
      
      if (searchResult.success) {
        const research = {
          topic,
          query: searchResult.results.query,
          results: searchResult.results.results,
          summary: searchResult.results.summary,
          provider: searchResult.provider,
          timestamp: Date.now()
        };
        
        // Cache it
        await this.cache.set(topic, research);
        
        return research;
      }
    } catch (e) {
      console.error('Research failed:', e);
    }
    
    // Fallback to offline
    this._setStatus('OFFLINE MODE');
    return cached || this._getOfflineResearch(topic);
  }

  /**
   * Get offline research (local intelligence)
   */
  _getOfflineResearch(topic) {
    return {
      topic,
      results: [],
      summary: 'Offline mode - using local intelligence',
      offline: true,
      timestamp: Date.now()
    };
  }

  /**
   * Extract insights from research
   */
  _extractInsights(research) {
    if (!research || !research.results) {
      return { trends: [], questions: [], painPoints: [] };
    }

    const insights = {
      trends: [],
      questions: [],
      painPoints: [],
      keywords: [],
      angles: []
    };

    // Extract from results
    research.results.forEach(r => {
      if (r.title) {
        insights.keywords.push(...r.title.split(' ').filter(w => w.length > 4));
      }
    });

    // Dedupe keywords
    insights.keywords = [...new Set(insights.keywords)].slice(0, 20);

    return insights;
  }

  /**
   * Set status
   */
  _setStatus(status) {
    this.status = status;
  }

  /**
   * Get status
   */
  getStatus() {
    return {
      state: this.connectivity.getState(),
      researchStatus: this.status,
      provider: this.provider.currentProvider
    };
  }

  /**
   * Clear cache
   */
  async clearCache() {
    await this.cache.clear();
  }

  /**
   * Set research mode
   */
  setMode(mode) {
    this.mode = mode;
  }
}

export default ResearchEngine;

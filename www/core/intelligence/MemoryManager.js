/**
 * Memory Manager
 * Tracks and manages used content elements to ensure variety and uniqueness
 * Phase 8: Enhanced Memory System
 */

/**
 * MemoryManager
 * Tracks hooks, CTAs, adjectives, verbs, emoji combinations, sentence structures
 * to avoid repetition and ensure unique outputs
 */
export class MemoryManager {
  constructor(options = {}) {
    this.maxHistory = options.maxHistory || 100;
    this.maxRecentItems = options.maxRecentItems || 20;
    this.cooldownPeriod = options.cooldownPeriod || 10; // generations before reuse

    // Memory stores with timestamps
    this.memory = {
      hooks: [],
      ctas: [],
      adjectives: [],
      verbs: [],
      emojiCombos: [],
      sentenceStarts: [],
      sentenceStructures: [],
      paragraphStructures: [],
      transitions: [],
      topics: [],
      entities: [],
      patterns: [],
      personalityStyles: []
    };

    // Phrase banks for variety
    this.phraseBanks = {
      adjectives: [
        'incredible', 'remarkable', 'game-changing', 'essential', 'powerful',
        'transformative', 'mindful', 'strategic', 'intentional', 'genuine',
        'authentic', 'fresh', 'bold', 'clean', 'minimal', 'elevated',
        'thoughtful', 'practical', 'proven', 'effective', 'dynamic',
        'innovative', 'creative', 'smart', 'efficient', 'impactful',
        'valuable', 'unique', 'distinctive', 'premium', 'refined'
      ],
      verbs: [
        'discover', 'transform', 'master', 'unlock', 'elevate', 'accelerate',
        'optimize', 'streamline', 'revolutionize', 'amplify', 'enhance',
        'boost', 'ignite', 'spark', 'inspire', 'motivate', 'drive',
        'craft', 'build', 'create', 'design', 'develop', 'launch',
        'grow', 'scale', 'expand', 'leverage', 'utilize', 'implement',
        'achieve', 'accomplish', 'reach', 'attain', 'unlock', 'reveal'
      ],
      transitions: {
        causal: ['so', 'therefore', 'which means', 'as a result', 'consequently'],
        additive: ['plus', 'also', 'additionally', 'moreover', 'furthermore', 'on top of that'],
        contrast: ['but', 'however', 'although', 'while', 'whereas', 'on the other hand', 'that said'],
        temporal: ['first', 'then', 'next', 'after', 'before', 'finally', 'ultimately', 'in the end'],
        illustrative: ['for example', 'like', 'such as', 'specifically', 'in particular'],
        emphatic: ['especially', 'particularly', 'notably', 'significantly', 'above all']
      },
      sentenceStarts: {
        viral: [
          'POV:', 'Nobody is talking about', 'I tried', 'The thing nobody tells you',
          'Wait for it...', 'Breaking:', 'Hot take:', 'Real talk:'
        ],
        storytelling: [
          'Three years ago', 'The moment', 'What nobody tells you', 'A day I\'ll never forget',
          'Looking back', 'It started with', 'The turning point was'
        ],
        educational: [
          'Here\'s the thing', 'What most people miss', 'The key insight', 'What you need to know',
          'The fundamentals', 'Understanding', 'Breaking down'
        ],
        professional: [
          'Research shows', 'Studies indicate', 'The data suggests', 'Industry experts agree',
          'Key considerations', 'Strategic approach', 'Best practices indicate'
        ]
      }
    };

    // Load from localStorage if available
    this._loadFromStorage();
  }

  /**
   * Track an item as used
   */
  track(type, value, metadata = {}) {
    if (!this.memory[type]) {
      this.memory[type] = [];
    }

    const entry = {
      value,
      timestamp: Date.now(),
      metadata,
      uses: 1
    };

    // Check if already exists
    const existingIndex = this.memory[type].findIndex(e => e.value === value);
    if (existingIndex >= 0) {
      this.memory[type][existingIndex].uses++;
      this.memory[type][existingIndex].timestamp = Date.now();
    } else {
      this.memory[type].unshift(entry);
    }

    // Trim to max size
    if (this.memory[type].length > this.maxHistory) {
      this.memory[type] = this.memory[type].slice(0, this.maxHistory);
    }

    // Persist
    this._saveToStorage();
  }

  /**
   * Track multiple items
   */
  trackMany(items) {
    Object.entries(items).forEach(([type, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => this.track(type, v));
      } else {
        this.track(type, value);
      }
    });
  }

  /**
   * Get an unused item from a list
   */
  getUnused(type, items) {
    if (!items || items.length === 0) return null;

    const recentItems = this.getRecent(type);
    const recentValues = recentItems.map(e => e.value.toLowerCase());

    // Filter out recently used items
    const available = items.filter(item => 
      !recentValues.includes(item.toLowerCase())
    );

    // If all items used, return random from original list
    if (available.length === 0) {
      return items[Math.floor(Math.random() * items.length)];
    }

    // Return random from available
    return available[Math.floor(Math.random() * available.length)];
  }

  /**
   * Get item from phrase bank with memory tracking
   */
  getPhrase(type, subtype = null, personality = 'default') {
    let phrases;

    if (subtype && this.phraseBanks[type]?.[subtype]) {
      phrases = this.phraseBanks[type][subtype];
    } else if (this.phraseBanks[type]) {
      phrases = this.phraseBanks[type];
    } else {
      return null;
    }

    // Get personality-specific if available
    if (subtype === 'sentenceStarts' && this.phraseBanks.sentenceStarts[personality]) {
      phrases = this.phraseBanks.sentenceStarts[personality];
    }

    return this.getUnused(type, phrases);
  }

  /**
   * Get recently used items of a type
   */
  getRecent(type, limit = 10) {
    const items = this.memory[type] || [];
    return items.slice(0, limit);
  }

  /**
   * Get recently used values for a type
   */
  getRecentValues(type, limit = 10) {
    return this.getRecent(type, limit).map(e => e.value);
  }

  /**
   * Check if item was used recently
   */
  wasUsedRecently(type, value, withinGenerations = 5) {
    const recent = this.getRecent(type, withinGenerations);
    return recent.some(e => e.value.toLowerCase() === value.toLowerCase());
  }

  /**
   * Get usage count for an item
   */
  getUsageCount(type, value) {
    const entry = this.memory[type]?.find(e => e.value.toLowerCase() === value.toLowerCase());
    return entry?.uses || 0;
  }

  /**
   * Get statistics about memory usage
   */
  getStats() {
    const stats = {};
    
    Object.keys(this.memory).forEach(type => {
      const items = this.memory[type];
      stats[type] = {
        totalUnique: items.length,
        totalUses: items.reduce((sum, e) => sum + e.uses, 0),
        mostUsed: items.length > 0 
          ? items.reduce((max, e) => e.uses > max.uses ? e : max, items[0])
          : null
      };
    });

    return stats;
  }

  /**
   * Reset specific memory type
   */
  reset(type = null) {
    if (type) {
      this.memory[type] = [];
    } else {
      Object.keys(this.memory).forEach(key => {
        this.memory[key] = [];
      });
    }
    this._saveToStorage();
  }

  /**
   * Clear cooldown - allow items to be reused
   */
  clearCooldown(type, value = null) {
    if (value) {
      const entry = this.memory[type]?.find(e => e.value.toLowerCase() === value.toLowerCase());
      if (entry) {
        entry.timestamp = 0;
      }
    } else if (type) {
      this.memory[type]?.forEach(e => e.timestamp = 0);
    } else {
      Object.values(this.memory).forEach(items => {
        items.forEach(e => e.timestamp = 0);
      });
    }
  }

  /**
   * Get diversity score for content
   */
  getDiversityScore(content) {
    const words = content.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const varietyRatio = uniqueWords.size / words.length;

    // Check for repetitive phrases
    const recentHooks = this.getRecentValues('hooks', 5);
    const hookOverlap = recentHooks.filter(hook => 
      content.toLowerCase().includes(hook.toLowerCase().substring(0, 20))
    ).length;

    let score = varietyRatio * 100;
    
    // Penalize if using recent hooks
    score -= hookOverlap * 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Extract and track elements from generated content
   */
  analyzeAndTrack(content, metadata = {}) {
    const extracted = {
      topics: this._extractTopics(content),
      entities: this._extractEntities(content),
      adjectives: this._extractAdjectives(content),
      verbs: this._extractVerbs(content)
    };

    // Track hooks (first sentence)
    const firstSentence = content.split(/[.!?]/)[0]?.trim();
    if (firstSentence) {
      extracted.hooks = [firstSentence];
    }

    // Track CTAs (last line or call-to-action phrases)
    const ctaPatterns = /follow|share|comment|save|tag|dm|click|link in bio|shop|buy/gi;
    const ctaMatches = content.match(ctaPatterns) || [];
    if (ctaMatches.length > 0) {
      extracted.ctas = [...new Set(ctaMatches.map(m => m.toLowerCase()))];
    }

    // Track patterns
    if (metadata.pattern) {
      extracted.patterns = [metadata.pattern];
    }

    // Track personality
    if (metadata.personality) {
      extracted.personalityStyles = [metadata.personality];
    }

    // Track everything
    Object.entries(extracted).forEach(([type, values]) => {
      values.forEach(value => this.track(type, value, metadata));
    });

    return extracted;
  }

  _extractTopics(content) {
    // Extract capitalized phrases that might be topics
    const topicPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    return [...new Set(content.match(topicPattern) || [])];
  }

  _extractEntities(content) {
    // Extract potential brand/product names (capitalized, not common words)
    const commonWords = ['The', 'This', 'That', 'What', 'When', 'Where', 'How', 'Why', 'But', 'And', 'For', 'With', 'About'];
    const entityPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    const matches = content.match(entityPattern) || [];
    return [...new Set(matches.filter(m => !commonWords.includes(m)))];
  }

  _extractAdjectives(content) {
    // Extract potential adjectives (simplified)
    const adjectives = this.phraseBanks.adjectives;
    const words = content.toLowerCase().split(/\s+/);
    return words.filter(w => adjectives.includes(w.replace(/[^a-z]/g, '')));
  }

  _extractVerbs(content) {
    // Extract potential verbs (simplified)
    const verbs = this.phraseBanks.verbs;
    const words = content.toLowerCase().split(/\s+/);
    return words.filter(w => verbs.includes(w.replace(/[^a-z]/g, '')));
  }

  /**
   * Generate a unique combination of elements
   */
  generateUniqueCombo(type, count = 3) {
    const items = [];
    const usedValues = new Set();

    for (let i = 0; i < count; i++) {
      const item = this.getPhrase(type);
      if (item && !usedValues.has(item)) {
        items.push(item);
        usedValues.add(item);
        this.track(type, item);
      }
    }

    return items;
  }

  /**
   * Save memory to localStorage
   */
  _saveToStorage() {
    try {
      const serializable = {};
      Object.keys(this.memory).forEach(type => {
        serializable[type] = this.memory[type].map(({ value, timestamp, uses }) => ({
          value,
          timestamp,
          uses
        }));
      });
      localStorage.setItem('ig-toolkit-memory', JSON.stringify(serializable));
    } catch (e) {
      console.warn('Failed to save memory to localStorage:', e);
    }
  }

  /**
   * Load memory from localStorage
   */
  _loadFromStorage() {
    try {
      const saved = localStorage.getItem('ig-toolkit-memory');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(type => {
          this.memory[type] = parsed[type];
        });
      }
    } catch (e) {
      console.warn('Failed to load memory from localStorage:', e);
    }
  }

  /**
   * Export memory for backup
   */
  export() {
    return JSON.stringify(this.memory, null, 2);
  }

  /**
   * Import memory from backup
   */
  import(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      Object.keys(imported).forEach(type => {
        this.memory[type] = imported[type];
      });
      this._saveToStorage();
      return true;
    } catch (e) {
      console.error('Failed to import memory:', e);
      return false;
    }
  }
}

export default MemoryManager;

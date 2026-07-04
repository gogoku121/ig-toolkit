/**
 * SimilarityEngine
 * Computes similarity between captions and detects duplicates
 * Uses multiple algorithms: Jaccard, cosine, Levenshtein
 */

export class SimilarityEngine {
  constructor() {
    this.recentContent = [];
    this.maxRecent = 50;
    this.threshold = 0.7; // 70% similarity triggers regeneration
  }

  /**
   * Compute overall similarity between two texts
   */
  computeSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    
    const normalized1 = this._normalize(text1);
    const normalized2 = this._normalize(text2);
    
    // Weighted combination of similarity measures
    const jaccard = this._jaccardSimilarity(normalized1, normalized2);
    const cosine = this._cosineSimilarity(normalized1, normalized2);
    const levenshtein = this._levenshteinSimilarity(normalized1, normalized2);
    
    // Weighted average (cosine most reliable for longer texts)
    return (jaccard * 0.3 + cosine * 0.4 + levenshtein * 0.3);
  }

  /**
   * Normalize text for comparison
   */
  _normalize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();
  }

  /**
   * Jaccard similarity (word overlap)
   */
  _jaccardSimilarity(text1, text2) {
    const words1 = new Set(text1.split(/\s+/));
    const words2 = new Set(text2.split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Cosine similarity (TF-IDF style)
   */
  _cosineSimilarity(text1, text2) {
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    
    const tf1 = this._termFrequency(words1);
    const tf2 = this._termFrequency(words2);
    
    const allWords = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    allWords.forEach(word => {
      const val1 = tf1[word] || 0;
      const val2 = tf2[word] || 0;
      
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    });
    
    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    return denominator > 0 ? dotProduct / denominator : 0;
  }

  /**
   * Term frequency
   */
  _termFrequency(words) {
    const tf = {};
    words.forEach(word => {
      if (word.length > 2) { // Ignore very short words
        tf[word] = (tf[word] || 0) + 1;
      }
    });
    return tf;
  }

  /**
   * Levenshtein similarity (edit distance based)
   */
  _levenshteinSimilarity(text1, text2) {
    const distance = this._levenshteinDistance(text1, text2);
    const maxLength = Math.max(text1.length, text2.length);
    return maxLength > 0 ? 1 - (distance / maxLength) : 1;
  }

  /**
   * Levenshtein distance
   */
  _levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    
    if (m === 0) return n;
    if (n === 0) return m;
    
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    return dp[m][n];
  }

  /**
   * Compare new content against recent content
   */
  checkAgainstRecent(content) {
    if (!content || this.recentContent.length === 0) {
      return { isDuplicate: false, maxSimilarity: 0, similarContent: null };
    }
    
    let maxSimilarity = 0;
    let mostSimilar = null;
    
    for (const recent of this.recentContent) {
      const similarity = this.computeSimilarity(content, recent.text);
      
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        mostSimilar = recent;
      }
    }
    
    return {
      isDuplicate: maxSimilarity >= this.threshold,
      maxSimilarity: Math.round(maxSimilarity * 100) / 100,
      similarContent: mostSimilar
    };
  }

  /**
   * Check if content is too similar to any recent
   */
  isTooSimilar(content) {
    const result = this.checkAgainstRecent(content);
    return result.isDuplicate;
  }

  /**
   * Add content to recent history
   */
  addToRecent(content, metadata = {}) {
    this.recentContent.unshift({
      text: content,
      metadata,
      timestamp: Date.now()
    });
    
    // Prune old entries
    if (this.recentContent.length > this.maxRecent) {
      this.recentContent.splice(this.maxRecent);
    }
  }

  /**
   * Check similarity of specific sections
   */
  checkSectionSimilarity(newSection, sectionType) {
    const recentOfType = this.recentContent
      .filter(r => r.metadata?.section === sectionType);
    
    if (recentOfType.length === 0) {
      return { isDuplicate: false, maxSimilarity: 0 };
    }
    
    let maxSimilarity = 0;
    
    for (const recent of recentOfType) {
      const similarity = this.computeSimilarity(newSection, recent.text);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }
    
    return {
      isDuplicate: maxSimilarity >= this.threshold,
      maxSimilarity: Math.round(maxSimilarity * 100) / 100
    };
  }

  /**
   * Get diverse alternatives for regeneration
   */
  getDiversificationHints(content) {
    const hints = {
      hooks: [],
      structures: [],
      ctas: [],
      angles: []
    };
    
    // Analyze current content for what's likely duplicated
    const firstLine = content.split('\n')[0] || '';
    
    // Common hook patterns to avoid
    hints.hooks = [
      "Start with a question instead",
      "Try a bold statement",
      "Use 'POV:' format",
      "Begin with a surprising fact",
      "Start with 'Here's the thing'"
    ];
    
    // Alternative structures
    hints.structures = [
      "problem → solution → example",
      "story → lesson → action",
      "fact → misconception → truth",
      "question → answer → takeaway",
      "hook → 3 tips → CTA"
    ];
    
    // Alternative CTAs
    hints.ctas = [
      "Comment your thoughts",
      "Save for later",
      "Share with someone",
      "Follow for more",
      "Tag a friend"
    ];
    
    // Alternative angles
    hints.angles = [
      "Focus on practical application",
      "Lead with a personal story",
      "Start with a controversial take",
      "Use statistics or data",
      "Ask a thought-provoking question"
    ];
    
    return hints;
  }

  /**
   * Compute similarity report for debugging
   */
  getSimilarityReport(content, limit = 10) {
    const report = {
      content: content.substring(0, 100) + '...',
      comparisons: []
    };
    
    for (let i = 0; i < Math.min(this.recentContent.length, limit); i++) {
      const recent = this.recentContent[i];
      const similarity = this.computeSimilarity(content, recent.text);
      
      report.comparisons.push({
        index: i,
        timestamp: recent.timestamp,
        similarity: Math.round(similarity * 100) / 100,
        preview: recent.text.substring(0, 50) + '...'
      });
    }
    
    report.maxSimilarity = report.comparisons.length > 0 
      ? Math.max(...report.comparisons.map(c => c.similarity))
      : 0;
    
    return report;
  }

  /**
   * Load recent content from memory
   */
  loadFromMemory(recentContent) {
    this.recentContent = recentContent.map(c => ({
      text: c.content || c.text || '',
      metadata: c.metadata || {},
      timestamp: c.timestamp || Date.now()
    }));
  }

  /**
   * Get recent content for storage
   */
  getRecentForMemory() {
    return this.recentContent.map(c => ({
      text: c.text,
      metadata: c.metadata,
      timestamp: c.timestamp
    }));
  }

  /**
   * Clear recent history
   */
  clear() {
    this.recentContent = [];
  }

  /**
   * Set threshold
   */
  setThreshold(threshold) {
    this.threshold = Math.max(0, Math.min(1, threshold));
  }
}

export default SimilarityEngine;

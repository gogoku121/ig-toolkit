/**
 * Human Writing Engine
 * Eliminates robotic, template-like patterns to produce natural, varied content
 * that feels written by a human copywriter
 */

/**
 * HumanWritingEngine
 * Applies humanization techniques to generated content
 */
export class HumanWritingEngine {
  constructor() {
    this.usedPatterns = {
      sentenceStarts: [],
      transitions: [],
      emojis: [],
      hooks: [],
      closings: []
    };

    this.variationRules = {
      sentenceLength: {
        short: [8, 12, 15],
        medium: [15, 20, 25],
        long: [25, 35, 45],
        varied: [8, 12, 15, 20, 25, 30, 40]
      },
      paragraphLength: {
        short: [1, 2],
        medium: [2, 3],
        long: [3, 4],
        varied: [1, 2, 3, 4]
      }
    };
  }

  /**
   * Apply humanization to content
   * @param {string} content - Raw generated content
   * @param {Object} options - Humanization options
   * @returns {string} Humanized content
   */
  humanize(content, options = {}) {
    const {
      personality = 'default',
      topic,
      variation = 'high'
    } = options;

    let result = content;

    // Apply humanization layers
    result = this._varySentenceLength(result);
    result = this._varyParagraphStructure(result);
    result = this._varyPunctuation(result);
    result = this._varyTransitions(result);
    result = this._varyEmojiPlacement(result, personality);
    result = this._removeRepetitivePatterns(result);
    result = this._addRhythmVariation(result);
    result = this._varySentenceStarts(result);
    result = this._cleanUpFormatting(result);

    return result;
  }

  /**
   * Vary sentence length to create natural rhythm
   */
  _varySentenceLength(text) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    const variedSentences = sentences.map((sentence, index) => {
      const trimmed = sentence.trim();
      if (!trimmed) return '';

      // First and last sentences should be punchy
      if (index === 0 || index === sentences.length - 1) {
        return this._shortenSentence(trimmed);
      }

      // Randomly vary lengths in middle
      const random = Math.random();
      if (random < 0.3) {
        return this._shortenSentence(trimmed);
      } else if (random < 0.7) {
        return trimmed; // Keep original
      } else {
        return this._expandSentence(trimmed);
      }
    });

    return variedSentences.filter(s => s).join(' ');
  }

  _shortenSentence(sentence) {
    // Remove unnecessary clauses
    const shorteners = [
      /, honestly,/, /, literally,/, /, actually,/,
      /, basically,/, /, essentially,/, /, in general,/,
      /that actually/, /which is/, /that is/
    ];

    let result = sentence;
    shorteners.forEach(pattern => {
      result = result.replace(pattern, '');
    });

    // If sentence is still long, find a natural break point
    if (result.length > 100) {
      const breakPoint = result.lastIndexOf(',', 80);
      if (breakPoint > 40) {
        result = result.substring(0, breakPoint) + '.';
      }
    }

    return result;
  }

  _expandSentence(sentence) {
    // Add a punchy follow-up
    const expanders = [
      ` And honestly? That's the point.`,
      ` And that changes everything.`,
      ` Think about it.`,
      ` And most people miss that.`,
      ` That's the real insight.`,
      ` Here me out.`,
      ` Which is counterintuitive.`,
      ` And it's simpler than you think.`
    ];

    // Only expand if sentence is short
    if (sentence.length < 60 && !sentence.includes('.')) {
      return sentence + expanders[Math.floor(Math.random() * expanders.length)];
    }

    return sentence;
  }

  /**
   * Vary paragraph structure - some single line paragraphs, some multi-line
   */
  _varyParagraphStructure(text) {
    const paragraphs = text.split(/\n\n+/);
    
    const varied = paragraphs.map((para, index) => {
      const trimmed = para.trim();
      if (!trimmed) return '';

      // Sometimes break long paragraphs
      if (trimmed.length > 300 && Math.random() > 0.5) {
        const midPoint = Math.floor(trimmed.length / 2);
        const breakPoint = trimmed.indexOf('.', midPoint);
        
        if (breakPoint > midPoint && breakPoint < midPoint + 150) {
          const part1 = trimmed.substring(0, breakPoint + 1);
          const part2 = trimmed.substring(breakPoint + 1).trim();
          return part1 + '\n\n' + part2;
        }
      }

      // Sometimes combine short paragraphs
      if (trimmed.length < 50 && index < paragraphs.length - 1) {
        return trimmed;
      }

      return trimmed;
    });

    return varied.filter(p => p).join('\n\n');
  }

  /**
   * Vary punctuation to break monotony
   */
  _varyPunctuation(text) {
    let result = text;

    // Add occasional em-dashes for emphasis
    result = result.replace(/, honestly,/g, () => Math.random() > 0.5 ? ', honestly,' : ' — honestly,');
    result = result.replace(/, actually,/g, () => Math.random() > 0.5 ? ', actually,' : ' — actually,');
    result = result.replace(/, not gonna lie,/g, () => Math.random() > 0.5 ? ', not gonna lie,' : '. Not gonna lie:');

    // Vary question marks - sometimes multiple
    result = result.replace(/\?\s+What/g, () => Math.random() > 0.7 ? '?? What' : '? What');

    // Add ellipsis for effect
    if (Math.random() > 0.7) {
      result = result.replace(/\.\s+And/, () => '... And');
    }

    // Vary exclamation intensity
    result = result.replace(/\.\s+You know\?/g, () => {
      const options = ['... You know?', '. You know?!', '. You know.'];
      return options[Math.floor(Math.random() * options.length)];
    });

    return result;
  }

  /**
   * Vary transition words and phrases
   */
  _varyTransitions(text) {
    const transitionAlternatives = {
      'first': ['to start', 'initially', 'the first thing'],
      'second': ['next', 'then', 'after that', 'following that'],
      'finally': ['last but not least', 'to wrap up', 'at the end of the day', 'ultimately'],
      'however': ['but', 'that said', 'here\'s the thing', 'though', 'on the flip side'],
      'therefore': ['so', 'which means', 'which is why', 'that\'s why'],
      'additionally': ['also', 'on top of that', 'plus', 'as well as'],
      'moreover': ['plus', 'and here\'s what else', 'also'],
      'in conclusion': ['at the end of the day', 'to sum up', 'so basically', 'here\'s the TL;DR'],
      'for example': ['like when', 'take', 'specifically', 'like'],
      'in other words': ['basically', 'which is to say', 'so essentially'],
      'on the other hand': ['but then again', 'alternatively', 'or you could look at it this way'],
      'as a result': ['so', 'which led to', 'which gave us', 'the result was']
    };

    let result = text;
    Object.entries(transitionAlternatives).forEach(([original, alternatives]) => {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      result = result.replace(regex, () => {
        // 40% chance to replace
        if (Math.random() < 0.4) {
          return alternatives[Math.floor(Math.random() * alternatives.length)];
        }
        return original;
      });
    });

    return result;
  }

  /**
   * Vary emoji placement and usage based on personality
   */
  _varyEmojiPlacement(text, personality) {
    // Emoji preferences by personality
    const emojiPrefs = {
      'viral creator': { frequency: 0.3, positions: ['end', 'mid', 'standalone'] },
      'gen z': { frequency: 0.35, positions: ['end', 'mid', 'standalone', 'multiple'] },
      'influencer': { frequency: 0.25, positions: ['end', 'mid'] },
      'luxury brand': { frequency: 0.05, positions: ['end'] },
      'corporate': { frequency: 0, positions: [] },
      'minimalist': { frequency: 0.05, positions: ['end'] },
      default: { frequency: 0.15, positions: ['end', 'mid'] }
    };

    const prefs = emojiPrefs[personality] || emojiPrefs.default;

    // Don't add emojis to corporate content
    if (prefs.frequency === 0) return text;

    const emojis = ['🔥', '✨', '💯', '🙌', '👇', '💕', '🎯', '💪', '🤔', '👉', '✅', '⬇️', '🔄', '🔖', '💬'];

    // Sometimes add emoji to start
    if (Math.random() < prefs.frequency * 0.3 && prefs.positions.includes('standalone')) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      // Don't add to first line if it has a hook structure
      const lines = text.split('\n');
      if (lines[0] && lines[0].length > 20 && !lines[0].startsWith('#')) {
        lines[0] = emoji + ' ' + lines[0];
        return lines.join('\n');
      }
    }

    // Vary emoji at end
    if (Math.random() < prefs.frequency && prefs.positions.includes('end')) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      // Check if already has emoji
      if (!text.match(/[\u{1F300}-\u{1F9FF}]/u)) {
        const lines = text.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        
        // Don't add emoji after CTA that already has action words
        if (!lastLine.match(/(follow|share|comment|save|tag|dm)/i)) {
          lines[lines.length - 1] = lastLine.trim() + ' ' + emoji;
          return lines.join('\n');
        }
      }
    }

    return text;
  }

  /**
   * Remove repetitive patterns that scream "template"
   */
  _removeRepetitivePatterns(text) {
    let result = text;

    // Remove "Here's the thing" - overused
    result = result.replace(/Here's the thing[,:]?\s*/gi, () => {
      const alternatives = ['But here\'s what I\'ve learned:', 'Here\'s what matters:', 'The thing is:', 'And this matters:', 'Which is:', ''];
      return alternatives[Math.floor(Math.random() * alternatives.length)];
    });

    // Remove "At the end of the day" - overused
    result = result.replace(/At the end of the day[,:]?\s*/gi, () => {
      const alternatives = ['Ultimately,', 'When you think about it,', 'So really,', 'The bottom line:', 'In the end,', ''];
      return alternatives[Math.floor(Math.random() * alternatives.length)];
    });

    // Remove "The truth is" - overused
    result = result.replace(/The truth is[,:]?\s*/gi, () => {
      const alternatives = ['What I\'ve found:', 'What matters is:', 'Honestly,', 'The real talk:', 'Here\'s the real:', ''];
      return alternatives[Math.floor(Math.random() * alternatives.length)];
    });

    // Remove "Let me be clear" - corporate
    result = result.replace(/Let me be clear[,:]?\s*/gi, () => {
      return Math.random() > 0.5 ? 'Here\'s the thing:' : '';
    });

    // Remove multiple consecutive newlines
    result = result.replace(/\n{3,}/g, '\n\n');

    // Remove trailing punctuation before new paragraph
    result = result.replace(/\.\s*\n\n/g, '.\n\n');

    return result;
  }

  /**
   * Add rhythm variation through sentence structure
   */
  _addRhythmVariation(text) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    const varied = sentences.map((sentence, index) => {
      const trimmed = sentence.trim();
      if (!trimmed || trimmed.length < 10) return trimmed;

      // Don't vary first sentence
      if (index === 0) return trimmed;

      // Occasional fragments for punch
      if (Math.random() < 0.1 && trimmed.length > 50) {
        const words = trimmed.split(' ');
        if (words.length > 10) {
          // Make it a fragment
          const midpoint = Math.floor(words.length * 0.6);
          return words.slice(0, midpoint).join(' ') + '...';
        }
      }

      return trimmed;
    });

    return varied.filter(s => s).join(' ');
  }

  /**
   * Vary how sentences start
   */
  _varySentenceStarts(text) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    const starters = [
      { check: /^And/i, alternatives: ['Plus,', 'Also,', 'Additionally,', ''] },
      { check: /^But/i, alternatives: ['However,', 'That said,', 'Though,', ''] },
      { check: /^So/i, alternatives: ['Which means,', 'Therefore,', 'That\'s why,', ''] },
      { check: /^The /i, alternatives: ['One', 'A key', 'The main', 'This'] }
    ];

    const varied = sentences.map((sentence, index) => {
      // Don't vary first sentence
      if (index === 0) return sentence;

      let result = sentence;
      starters.forEach(({ check, alternatives }) => {
        if (check.test(result)) {
          if (Math.random() < 0.3) {
            const alt = alternatives[Math.floor(Math.random() * alternatives.length)];
            if (alt) {
              result = result.replace(check, alt + ' ');
            }
          }
        }
      });

      return result;
    });

    return varied.join(' ');
  }

  /**
   * Clean up formatting issues
   */
  _cleanUpFormatting(text) {
    let result = text;

    // Remove multiple spaces
    result = result.replace(/ {2,}/g, ' ');

    // Fix spacing around punctuation
    result = result.replace(/ ,/g, ',');
    result = result.replace(/ \./g, '.');
    result = result.replace(/ !/g, '!');
    result = result.replace(/ \?/g, '?');

    // Remove empty lines at start/end
    result = result.replace(/^\n+/, '');
    result = result.replace(/\n+$/, '');

    // Ensure proper spacing after colons
    result = result.replace(/:\s*/g, ': ');

    // Clean up bullet points
    result = result.replace(/^•\s*/gm, '• ');

    return result.trim();
  }

  /**
   * Generate a completely unique variation
   * @param {string} content - Original content
   * @param {Object} options - Generation options
   * @returns {string} Unique variation
   */
  generateUniqueVariation(content, options = {}) {
    const { personality = 'default', preserveMeaning = true } = options;

    // Apply multiple humanization passes
    let result = content;
    result = this.humanize(result, { personality, variation: 'high' });
    
    // Second pass with different focus
    result = this._varySentenceLength(result);
    result = this._varySentenceStarts(result);
    result = this._cleanUpFormatting(result);

    return result;
  }

  /**
   * Track used pattern to ensure variety
   */
  trackUsed(type, value) {
    if (!this.usedPatterns[type]) {
      this.usedPatterns[type] = [];
    }
    
    this.usedPatterns[type].push(value);
    
    // Keep only last 20
    if (this.usedPatterns[type].length > 20) {
      this.usedPatterns[type].shift();
    }
  }

  /**
   * Get unused alternative
   */
  getUnused(type, alternatives) {
    const used = this.usedPatterns[type] || [];
    const unused = alternatives.filter(alt => !used.includes(alt));
    
    if (unused.length === 0) {
      return alternatives[Math.floor(Math.random() * alternatives.length)];
    }
    
    return unused[Math.floor(Math.random() * unused.length)];
  }

  /**
   * Reset used patterns
   */
  resetPatterns() {
    this.usedPatterns = {
      sentenceStarts: [],
      transitions: [],
      emojis: [],
      hooks: [],
      closings: []
    };
  }
}

export default HumanWritingEngine;

/**
 * CuriosityEngine
 * Generates hooks that create information gaps
 * Avoids overused phrases and tracks usage
 */

export class CuriosityEngine {
  constructor() {
    this.recentHooks = [];
    this.maxRecentHooks = 50;
  }

  /**
   * Generate hooks with information gaps
   */
  generateHooks(topic, options = {}) {
    const {
      count = 10,
      personality = 'default',
      recentHooks = []
    } = options;

    // Merge recent hooks
    this.recentHooks = [...recentHooks, ...this.recentHooks].slice(0, this.maxRecentHooks);

    const hooks = [];

    // Gap-based hooks (create curiosity)
    hooks.push(...this._generateGapHooks(topic));

    // Pattern interrupt hooks
    hooks.push(...this._generateInterruptHooks(topic));

    // Contrarian hooks
    hooks.push(...this._generateContrarianHooks(topic));

    // Question hooks
    hooks.push(...this._generateQuestionHooks(topic));

    // Specific hooks
    hooks.push(...this._generateSpecificHooks(topic));

    // Filter out recently used
    const filtered = this._filterRecent(hooks);

    // Score and rank
    const scored = this._scoreHooks(filtered, topic, personality);

    return scored.slice(0, count);
  }

  /**
   * Generate gap-based hooks (information gaps)
   */
  _generateGapHooks(topic) {
    return [
      {
        type: 'gap',
        text: `What nobody tells you about ${topic}`,
        gap: 'insider knowledge',
        confidence: 0.9
      },
      {
        type: 'gap',
        text: `The ${topic} truth nobody shares`,
        gap: 'hidden truth',
        confidence: 0.85
      },
      {
        type: 'gap',
        text: `Here's what actually happens with ${topic}`,
        gap: 'reality vs perception',
        confidence: 0.85
      },
      {
        type: 'gap',
        text: `The ${topic} secret professionals don't discuss`,
        gap: 'professional insider',
        confidence: 0.8
      },
      {
        type: 'gap',
        text: `What the ${topic} industry doesn't want you to know`,
        gap: 'hidden information',
        confidence: 0.75
      },
      {
        type: 'gap',
        text: `The ${topic} reality nobody admits`,
        gap: 'unspoken truth',
        confidence: 0.8
      },
      {
        type: 'gap',
        text: `The ${topic} failure nobody talks about`,
        gap: 'failure insight',
        confidence: 0.75
      },
      {
        type: 'gap',
        text: `What successful ${topic} actually looks like`,
        gap: 'real vs fake success',
        confidence: 0.85
      }
    ];
  }

  /**
   * Generate pattern interrupt hooks
   */
  _generateInterruptHooks(topic) {
    return [
      {
        type: 'interrupt',
        text: `POV: You finally understand ${topic}`,
        interrupt: 'perspective shift',
        confidence: 0.85
      },
      {
        type: 'interrupt',
        text: `Unpopular take on ${topic}`,
        interrupt: 'contrarian view',
        confidence: 0.8
      },
      {
        type: 'interrupt',
        text: `Hot take: Stop focusing on ${topic}`,
        interrupt: 'counterintuitive',
        confidence: 0.75
      },
      {
        type: 'interrupt',
        text: `Wait for it... the ${topic} truth`,
        interrupt: 'dramatic reveal',
        confidence: 0.7
      },
      {
        type: 'interrupt',
        text: `Not me realizing this about ${topic}...`,
        interrupt: 'relatable moment',
        confidence: 0.75
      },
      {
        type: 'interrupt',
        text: `Breaking: Everything about ${topic} is about to change`,
        interrupt: 'news value',
        confidence: 0.65
      },
      {
        type: 'interrupt',
        text: `Plot twist about ${topic}`,
        interrupt: 'unexpected',
        confidence: 0.75
      },
      {
        type: 'interrupt',
        text: `The ${topic} lie you've been believing`,
        interrupt: 'deception reveal',
        confidence: 0.8
      }
    ];
  }

  /**
   * Generate contrarian hooks
   */
  _generateContrarianHooks(topic) {
    return [
      {
        type: 'contrarian',
        text: `Why the ${topic} advice you've heard is backwards`,
        counter: 'conventional wisdom',
        confidence: 0.85
      },
      {
        type: 'contrarian',
        text: `Stop giving ${topic} advice. Here's why.`,
        counter: 'common recommendation',
        confidence: 0.8
      },
      {
        type: 'contrarian',
        text: `The ${topic} conventional wisdom is wrong`,
        counter: 'accepted belief',
        confidence: 0.75
      },
      {
        type: 'contrarian',
        text: `Most ${topic} tips are useless. Here's what works.`,
        counter: 'common tips',
        confidence: 0.8
      },
      {
        type: 'contrarian',
        text: `Why I was wrong about ${topic}`,
        counter: 'personal admission',
        confidence: 0.75
      },
      {
        type: 'contrarian',
        text: `Controversial opinion: ${topic} doesn't matter`,
        counter: 'high value claim',
        confidence: 0.7
      }
    ];
  }

  /**
   * Generate question hooks
   */
  _generateQuestionHooks(topic) {
    return [
      {
        type: 'question',
        text: `Why does ${topic} feel harder than it should?`,
        gap: 'unexplained difficulty',
        confidence: 0.8
      },
      {
        type: 'question',
        text: `What's the #1 ${topic} mistake?`,
        gap: 'surprising answer',
        confidence: 0.85
      },
      {
        type: 'question',
        text: `When did ${topic} get so complicated?`,
        gap: 'complexity insight',
        confidence: 0.75
      },
      {
        type: 'question',
        text: `Are you making this ${topic} mistake?`,
        gap: 'self-assessment',
        confidence: 0.8
      },
      {
        type: 'question',
        text: `What if everything you know about ${topic} is wrong?`,
        gap: 'radical doubt',
        confidence: 0.7
      },
      {
        type: 'question',
        text: `How much time are you wasting on ${topic}?`,
        gap: 'hidden cost',
        confidence: 0.75
      }
    ];
  }

  /**
   * Generate specific hooks
   */
  _generateSpecificHooks(topic) {
    return [
      {
        type: 'specific',
        text: `The ${topic} framework nobody uses`,
        specific: 'framework',
        confidence: 0.8
      },
      {
        type: 'specific',
        text: `X signs you understand ${topic} wrong`,
        specific: 'numbered list',
        confidence: 0.75
      },
      {
        type: 'specific',
        text: `The 1 thing that changes ${topic}`,
        specific: 'singular focus',
        confidence: 0.8
      },
      {
        type: 'specific',
        text: `${topic}: A case study`,
        specific: 'case study',
        confidence: 0.75
      },
      {
        type: 'specific',
        text: `The data on ${topic} might surprise you`,
        specific: 'data reveal',
        confidence: 0.7
      }
    ];
  }

  /**
   * Filter out recently used hooks
   */
  _filterRecent(hooks) {
    const recentTexts = this.recentHooks.map(h => h.toLowerCase());

    return hooks.filter(hook => {
      const hookText = hook.text.toLowerCase();
      const isSimilar = recentTexts.some(recent => 
        recent.includes(hookText.substring(0, 20)) ||
        hookText.includes(recent.substring(0, 20))
      );
      return !isSimilar;
    });
  }

  /**
   * Score hooks
   */
  _scoreHooks(hooks, topic, personality) {
    return hooks.map(hook => {
      let score = 50;

      // Higher confidence = higher score
      score += (hook.confidence || 0.5) * 30;

      // Gap hooks perform well
      if (hook.type === 'gap') score += 15;

      // Question hooks engage
      if (hook.type === 'question') score += 10;

      // Contrarian hooks drive engagement
      if (hook.type === 'contrarian') score += 15;

      // Specific hooks are valuable
      if (hook.type === 'specific' && hook.specific) score += 10;

      // Match to personality
      if (personality === 'gen z') {
        if (['interrupt', 'question'].includes(hook.type)) score += 15;
        if (hook.text.toLowerCase().includes('not me')) score += 10;
      }
      if (personality === 'viral creator') {
        if (hook.type === 'gap' || hook.type === 'contrarian') score += 10;
      }

      return { ...hook, score };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * Get best hook for topic
   */
  getBestHook(topic, options = {}) {
    const hooks = this.generateHooks(topic, { count: 1, ...options });
    return hooks[0] || null;
  }

  /**
   * Record hook as used
   */
  recordHook(hookText) {
    this.recentHooks.unshift(hookText);
    if (this.recentHooks.length > this.maxRecentHooks) {
      this.recentHooks.pop();
    }
  }

  /**
   * Get hook types for variety
   */
  getHookTypes() {
    return ['gap', 'interrupt', 'contrarian', 'question', 'specific'];
  }
}

export default CuriosityEngine;

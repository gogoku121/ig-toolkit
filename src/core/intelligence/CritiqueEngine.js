/**
 * Critique Engine
 * Self-critique and rewrite system for content quality improvement
 * Phase 9: Self-Critique & Rewrite with iterative improvement
 */

/**
 * CritiqueEngine
 * Evaluates content across multiple dimensions and rewrites weak sections
 */
export class CritiqueEngine {
  constructor() {
    this.maxIterations = 3;
    this.qualityThreshold = 85;
    
    this.criteria = {
      hook: {
        weight: 0.2,
        minScore: 85,
        checks: ['hasOpener', 'hasCuriosityGap', 'appropriateLength', 'noGenericStart']
      },
      readability: {
        weight: 0.2,
        minScore: 80,
        checks: ['sentenceLength', 'paragraphLength', 'variety', 'flow']
      },
      engagement: {
        weight: 0.2,
        minScore: 80,
        checks: ['hasQuestions', 'directAddress', 'emotionalWords', 'shareable']
      },
      uniqueness: {
        weight: 0.15,
        minScore: 85,
        checks: ['noClichés', 'noRepetition', 'freshVocabulary']
      },
      goalAlignment: {
        weight: 0.15,
        minScore: 80,
        checks: ['hasCTA', 'appropriateTone', 'matchesGoal']
      },
      cta: {
        weight: 0.1,
        minScore: 80,
        checks: ['ctaPresent', 'ctaClear', 'ctaActionable']
      }
    };

    this.rewriteRules = {
      weakHook: this._rewriteHook.bind(this),
      weakReadability: this._improveReadability.bind(this),
      weakEngagement: this._improveEngagement.bind(this),
      weakUniqueness: this._improveUniqueness.bind(this),
      weakCTA: this._improveCTA.bind(this)
    };
  }

  /**
   * Critique and potentially rewrite content
   * @param {string} content - Content to critique
   * @param {Object} options - Options including goal, personality
   * @returns {Object} Critique results with scores and rewritten content
   */
  critique(content, options = {}) {
    const { goal = 'engage', personality = 'default' } = options;

    // Initial scoring
    const scores = this._evaluateAll(content, goal);
    const totalScore = this._calculateTotalScore(scores);
    
    let critiqueResult = {
      content,
      scores,
      totalScore,
      grade: this._getGrade(totalScore),
      passed: totalScore >= this.qualityThreshold,
      iterations: 0,
      issues: this._identifyIssues(scores)
    };

    // If below threshold, attempt rewrites
    if (!critiqueResult.passed && critiqueResult.iterations < this.maxIterations) {
      const rewritten = this._rewriteWeakSections(
        content, 
        critiqueResult.issues, 
        goal, 
        personality
      );
      
      if (rewritten !== content) {
        critiqueResult.iterations++;
        critiqueResult.content = rewritten;
        
        // Re-score rewritten content
        const newScores = this._evaluateAll(rewritten, goal);
        critiqueResult.scores = newScores;
        critiqueResult.totalScore = this._calculateTotalScore(newScores);
        critiqueResult.grade = this._getGrade(critiqueResult.totalScore);
        critiqueResult.passed = critiqueResult.totalScore >= this.qualityThreshold;
        critiqueResult.issues = this._identifyIssues(newScores);
      }
    }

    return critiqueResult;
  }

  /**
   * Evaluate content across all criteria
   */
  _evaluateAll(content, goal) {
    const scores = {};

    for (const [criterion, config] of Object.entries(this.criteria)) {
      scores[criterion] = {
        score: this._evaluateCriterion(content, criterion, config.checks, goal),
        weight: config.weight,
        passed: true
      };
      scores[criterion].passed = scores[criterion].score >= config.minScore;
    }

    return scores;
  }

  /**
   * Evaluate a single criterion
   */
  _evaluateCriterion(content, criterion, checks, goal) {
    let totalScore = 100;
    const penalties = [];

    checks.forEach(check => {
      const result = this[`_${check}`](content, goal);
      if (!result.passed) {
        penalties.push({ check, penalty: result.penalty, detail: result.detail });
        totalScore -= result.penalty;
      }
    });

    return Math.max(0, Math.min(100, totalScore));
  }

  /**
   * Calculate weighted total score
   */
  _calculateTotalScore(scores) {
    let total = 0;
    let weightSum = 0;

    for (const [criterion, data] of Object.entries(scores)) {
      total += data.score * data.weight;
      weightSum += data.weight;
    }

    return Math.round(total / weightSum);
  }

  /**
   * Identify issues that need fixing
   */
  _identifyIssues(scores) {
    const issues = [];

    for (const [criterion, data] of Object.entries(scores)) {
      if (!data.passed) {
        issues.push({
          criterion,
          score: data.score,
          weight: data.weight,
          severity: data.score < 50 ? 'high' : 'medium'
        });
      }
    }

    // Sort by severity and weight
    issues.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1 };
      return severityOrder[a.severity] - severityOrder[b.severity] || b.weight - a.weight;
    });

    return issues;
  }

  /**
   * Rewrite weak sections
   */
  _rewriteWeakSections(content, issues, goal, personality) {
    let result = content;

    for (const issue of issues) {
      if (issue.criterion === 'hook') {
        result = this._rewriteHook(result, personality);
      } else if (issue.criterion === 'readability') {
        result = this._improveReadability(result);
      } else if (issue.criterion === 'engagement') {
        result = this._improveEngagement(result, goal);
      } else if (issue.criterion === 'uniqueness') {
        result = this._improveUniqueness(result);
      } else if (issue.criterion === 'cta') {
        result = this._improveCTA(result, goal);
      }
    }

    return result;
  }

  // Check methods
  _hasOpener(content) {
    const openers = ['POV:', 'I tried', 'Nobody is', 'The', 'Wait', 'Breaking:', 'Hot take:', 'Real talk:'];
    const hasOpener = openers.some(opener => content.toLowerCase().startsWith(opener.toLowerCase()));
    return {
      passed: hasOpener,
      penalty: hasOpener ? 0 : 20,
      detail: hasOpener ? 'Strong opener' : 'Missing strong opener'
    };
  }

  _hasCuriosityGap(content) {
    const curiosityPhrases = ['nobody talks about', 'secret', 'mistake', 'truth', 'what nobody'];
    const hasGap = curiosityPhrases.some(phrase => content.toLowerCase().includes(phrase));
    return {
      passed: hasGap,
      penalty: hasGap ? 0 : 15,
      detail: hasGap ? 'Has curiosity gap' : 'Missing curiosity gap'
    };
  }

  _appropriateLength(content) {
    const length = content.length;
    const passed = length >= 100 && length <= 2000;
    return {
      passed,
      penalty: passed ? 0 : length < 100 ? 25 : 10,
      detail: `Length: ${length} chars`
    };
  }

  _noGenericStart(content) {
    const genericStarts = ['here\'s how', 'in this post', 'today we', 'in this article', 'let me tell'];
    const isGeneric = genericStarts.some(start => content.toLowerCase().startsWith(start));
    return {
      passed: !isGeneric,
      penalty: isGeneric ? 15 : 0,
      detail: isGeneric ? 'Generic opener' : 'No generic opener'
    };
  }

  _sentenceLength(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgLength = sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length;
    const passed = avgLength >= 8 && avgLength <= 25;
    return {
      passed,
      penalty: passed ? 0 : avgLength < 8 ? 10 : 5,
      detail: `Avg sentence: ${avgLength.toFixed(1)} words`
    };
  }

  _paragraphLength(content) {
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    const passed = paragraphs.every(p => p.length <= 400);
    return {
      passed,
      penalty: passed ? 0 : 10,
      detail: `${paragraphs.length} paragraphs`
    };
  }

  _variety(content) {
    const words = content.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const ratio = uniqueWords.size / words.length;
    const passed = ratio >= 0.4;
    return {
      passed,
      penalty: passed ? 0 : (0.4 - ratio) * 50,
      detail: `Variety: ${(ratio * 100).toFixed(0)}%`
    };
  }

  _flow(content) {
    const sentences = content.split(/[.!?]+/);
    const shortSentences = sentences.filter(s => s.trim().split(/\s+/).length < 4);
    const hasFlow = shortSentences.length <= sentences.length * 0.3;
    return {
      passed: hasFlow,
      penalty: hasFlow ? 0 : 10,
      detail: hasFlow ? 'Good flow' : 'Too many short sentences'
    };
  }

  _hasQuestions(content) {
    const questionCount = (content.match(/\?/g) || []).length;
    const passed = questionCount >= 0 && questionCount <= 3;
    return {
      passed,
      penalty: 0, // Questions are optional
      detail: `${questionCount} questions`
    };
  }

  _directAddress(content) {
    const pronouns = /\b(you|your|we|us|our)\b/gi;
    const matches = content.match(pronouns) || [];
    const passed = matches.length >= 2 && matches.length <= 10;
    return {
      passed,
      penalty: passed ? 0 : matches.length < 2 ? 10 : 5,
      detail: `${matches.length} direct addresses`
    };
  }

  _emotionalWords(content) {
    const emotionalWords = /honestly|actually|really|truly|basically|seriously|literally|finally|actually/g;
    const matches = content.match(emotionalWords) || [];
    const passed = matches.length <= 4;
    return {
      passed,
      penalty: passed ? 0 : (matches.length - 4) * 3,
      detail: `${matches.length} filler words`
    };
  }

  _shareable(content) {
    const shareTriggers = ['share', 'tag', 'send', 'someone who', 'friend', 'bestie'];
    const hasTrigger = shareTriggers.some(t => content.toLowerCase().includes(t));
    return {
      passed: true, // Shareability is optional
      penalty: hasTrigger ? 0 : 0,
      detail: hasTrigger ? 'Has share trigger' : 'No explicit share trigger'
    };
  }

  _noClichés(content) {
    const clichés = [
      'at the end of the day', 'here\'s the thing', 'the truth is', 
      'let me be clear', 'in conclusion', 'needless to say',
      'it goes without saying', 'last but not least', 'think outside the box',
      'low hanging fruit', 'move the needle', 'circle back'
    ];
    const foundClichés = clichés.filter(c => content.toLowerCase().includes(c));
    const passed = foundClichés.length === 0;
    return {
      passed,
      penalty: passed ? 0 : foundClichés.length * 10,
      detail: foundClichés.length > 0 ? `Clichés: ${foundClichés.length}` : 'No clichés'
    };
  }

  _noRepetition(content) {
    const words = content.toLowerCase().split(/\s+/);
    const wordCounts = {};
    words.forEach(w => {
      const cleaned = w.replace(/[^a-z]/g, '');
      if (cleaned.length > 3) {
        wordCounts[cleaned] = (wordCounts[cleaned] || 0) + 1;
      }
    });
    const maxRepetition = Math.max(...Object.values(wordCounts));
    const passed = maxRepetition <= 4;
    return {
      passed,
      penalty: passed ? 0 : (maxRepetition - 4) * 5,
      detail: `Max word repetition: ${maxRepetition}`
    };
  }

  _freshVocabulary(content) {
    const overused = ['great', 'good', 'nice', 'best', 'amazing', 'awesome', 'very', 'really', 'thing', 'stuff'];
    const words = content.toLowerCase().split(/\s+/);
    const overusedCount = words.filter(w => overused.includes(w.replace(/[^a-z]/g, ''))).length;
    const ratio = overusedCount / words.length;
    const passed = ratio < 0.1;
    return {
      passed,
      penalty: passed ? 0 : ratio * 100,
      detail: `Overused words: ${overusedCount}`
    };
  }

  _hasCTA(content) {
    const ctaPatterns = /follow|share|comment|save|tag|dm|click|link in bio|shop|buy/gi;
    const hasCTA = ctaPatterns.test(content);
    return {
      passed: hasCTA,
      penalty: hasCTA ? 0 : 30,
      detail: hasCTA ? 'Has CTA' : 'Missing CTA'
    };
  }

  _appropriateTone(content) {
    // Basic check - content should have varied punctuation
    const exclamations = (content.match(/!/g) || []).length;
    const questions = (content.match(/\?/g) || []).length;
    const periods = (content.match(/\./g) || []).length;
    
    const total = exclamations + questions + periods;
    const variety = total > 0 ? (exclamations + questions) / total : 0;
    const passed = variety <= 0.5; // Not too many exclamations/questions
    
    return {
      passed,
      penalty: passed ? 0 : 10,
      detail: `Tone variety: ${(variety * 100).toFixed(0)}%`
    };
  }

  _matchesGoal(content, goal) {
    const goalIndicators = {
      'generate comments': /\?|comment|tell me|your thoughts/i,
      'generate shares': /share|tag|send this/i,
      'generate saves': /save|bookmark|pin/i,
      sell: /link in bio|shop|buy now/i,
      educate: /here\'s what|understanding|learn/i,
      inspire: /never give|keep going/i
    };
    
    const pattern = goalIndicators[goal];
    if (!pattern) return { passed: true, penalty: 0, detail: 'Goal alignment check' };
    
    const matches = pattern.test(content);
    return {
      passed: matches,
      penalty: matches ? 0 : 15,
      detail: matches ? 'Matches goal' : 'Goal alignment weak'
    };
  }

  _ctaPresent(content) {
    return this._hasCTA(content);
  }

  _ctaClear(content) {
    const ctaPatterns = /follow|share|comment|save|tag|dm|click|link in bio|shop|buy/gi;
    const matches = content.match(ctaPatterns) || [];
    const passed = matches.length >= 1 && matches.length <= 3;
    return {
      passed,
      penalty: passed ? 0 : matches.length === 0 ? 20 : 5,
      detail: `${matches.length} CTAs`
    };
  }

  _ctaActionable(content) {
    const lines = content.split('\n');
    const lastLine = lines[lines.length - 1] || '';
    const actionable = /follow|share|comment|save|tag|dm|click|shop|buy/i;
    const passed = actionable.test(lastLine);
    return {
      passed,
      penalty: passed ? 0 : 15,
      detail: passed ? 'CTA is actionable' : 'CTA not clear/actionable'
    };
  }

  // Rewrite methods
  _rewriteHook(content, personality) {
    const lines = content.split('\n');
    const hook = lines[0];
    
    const newHooks = {
      viral: [
        'POV: You finally discover the thing nobody talks about',
        'Nobody is talking about this and it\'s driving me crazy',
        'I tried this for 30 days and...',
        'The truth about what nobody tells you',
        'Wait for it...'
      ],
      genz: [
        'no bc someone explained this to me finally',
        'the way I wish someone told me about this sooner',
        'rating this on a scale of yikes to obsessed',
        'main character energy: this edition'
      ],
      storytelling: [
        'Three years ago, I almost gave up. Here\'s what changed.',
        'The story that still gives me chills',
        'What nobody tells you about the journey',
        'A moment that redefined everything'
      ],
      default: [
        'The thing about this that nobody talks about',
        'Here\'s what I wish I knew sooner',
        'The truth nobody is telling you',
        'What nobody explains about this'
      ]
    };

    const hooks = newHooks[personality] || newHooks.default;
    const newHook = hooks[Math.floor(Math.random() * hooks.length)];
    
    lines[0] = newHook;
    return lines.join('\n');
  }

  _improveReadability(content) {
    let result = content;
    
    // Split long sentences
    const sentences = result.split(/(?<=[.!?])\s+/);
    const improved = sentences.map(sentence => {
      const words = sentence.trim().split(/\s+/);
      if (words.length > 25) {
        // Find a natural break point (comma)
        const commaIndex = sentence.indexOf(',', sentence.length / 2);
        if (commaIndex > 0) {
          return sentence.substring(0, commaIndex + 1) + '\n\n' + sentence.substring(commaIndex + 1).trim();
        }
      }
      return sentence;
    });

    return improved.join(' ');
  }

  _improveEngagement(content, goal) {
    let result = content;
    
    // Add question if goal is to generate comments
    if (goal === 'generate comments' && !result.includes('?')) {
      const questions = [
        'What\'s your take on this?',
        'Comment your thoughts below.',
        'Tell me I\'m wrong.',
        'What would you add?'
      ];
      const question = questions[Math.floor(Math.random() * questions.length)];
      result += '\n\n' + question;
    }
    
    // Add direct address if missing
    if (!/(you|your)\b/i.test(result)) {
      result = result.replace(/^(.+?)(\.)/, '$1. You');
    }

    return result;
  }

  _improveUniqueness(content) {
    let result = content;
    
    // Replace clichés
    const clichés = [
      { find: /at the end of the day/gi, replace: 'ultimately' },
      { find: /here\'s the thing/gi, replace: 'here\'s what I\'ve learned' },
      { find: /the truth is/gi, replace: 'what I\'ve found is' },
      { find: /needless to say/gi, replace: '' },
      { find: /in conclusion/gi, replace: 'so basically' }
    ];

    clichés.forEach(({ find, replace }) => {
      result = result.replace(find, replace);
    });

    return result;
  }

  _improveCTA(content, goal) {
    const ctas = {
      'generate comments': ['Drop your thoughts below 👇', 'Comment below', 'Tell me your experience'],
      'generate shares': ['Share this with someone who needs it 🔄', 'Tag a friend', 'Send it to your bestie'],
      'generate saves': ['Save this for later 🔖', 'Bookmark this', 'Pin it for reference'],
      sell: ['Link in bio', 'Shop now', 'Get started today'],
      educate: ['Follow for more', 'Save this post', 'Share with someone learning'],
      inspire: ['Save this for motivation', 'Share with someone who needs this', 'Follow for daily inspiration'],
      engage: ['Follow for more like this!', 'Drop a ❤️', 'Comment below'],
      default: ['Follow for more!', 'Save this post', 'Share your thoughts']
    };

    const lines = content.split('\n');
    const lastLine = lines[lines.length - 1];
    const goalCTAs = ctas[goal] || ctas.default;
    
    // Check if last line already has a CTA
    const hasCTA = /follow|share|comment|save|tag|dm|click|shop|buy/i.test(lastLine);
    
    if (!hasCTA) {
      const newCTA = goalCTAs[Math.floor(Math.random() * goalCTAs.length)];
      lines[lines.length - 1] = lastLine + ' ' + newCTA;
    }

    return lines.join('\n');
  }

  _getGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Get detailed feedback for content
   */
  getFeedback(scores) {
    const feedback = [];

    for (const [criterion, data] of Object.entries(scores)) {
      if (!data.passed) {
        feedback.push({
          aspect: criterion,
          score: data.score,
          suggestion: this._getSuggestion(criterion, data.score)
        });
      }
    }

    return feedback;
  }

  _getSuggestion(criterion, score) {
    const suggestions = {
      hook: score < 50 
        ? 'Rewrite the opener completely - use POV, "nobody talks about", or a bold statement'
        : 'Strengthen the hook with a curiosity gap or surprising angle',
      readability: score < 50
        ? 'Break up long sentences and vary paragraph length'
        : 'Check sentence variety and flow',
      engagement: score < 50
        ? 'Add questions, direct address ("you"), or emotional triggers'
        : 'Increase reader engagement with more interaction prompts',
      uniqueness: score < 50
        ? 'Remove clichés and overused phrases - write fresher'
        : 'Check for repetitive words or phrases',
      goalAlignment: score < 50
        ? 'Ensure content matches the stated goal with clear CTA'
        : 'Strengthen goal alignment and call-to-action',
      cta: score < 50
        ? 'Add a clear, actionable call-to-action at the end'
        : 'Make CTA more specific and actionable'
    };

    return suggestions[criterion] || 'Review and improve this section';
  }
}

export default CritiqueEngine;

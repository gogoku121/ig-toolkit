/**
 * OriginalityEngine
 * Core engine that asks the questions that matter:
 * - Is this surprising?
 * - Would someone save this?
 * - Could another generator have produced this?
 * - Is there one sentence that makes the reader stop scrolling?
 * 
 * This is the single most important improvement for perceived quality.
 */

export class OriginalityEngine {
  constructor() {
    this.commonPhrases = this._buildCommonPhrases();
    this.templatePatterns = this._buildTemplatePatterns();
    this.stopScrollTriggers = this._buildStopScrollTriggers();
  }

  /**
   * Check if content is original and engaging
   */
  check(content, options = {}) {
    const { topic = '', recentContent = [] } = options;

    const results = {
      // Core originality questions
      isSurprising: this._checkSurprising(content),
      wouldSave: this._checkWouldSave(content),
      isTemplateGenerated: this._checkIfTemplateGenerated(content),
      hasStopScrollSentence: this._findStopScrollSentence(content),
      
      // Quality checks
      hasOriginalInsight: this._checkHasOriginalInsight(content),
      hasConcreteExample: this._checkHasConcreteExample(content),
      hasActionableTakeaway: this._checkHasActionableTakeaway(content),
      hasEmotionalEngagement: this._checkHasEmotionalEngagement(content),
      hasDiscussionWorthy: this._checkHasDiscussionWorthy(content),
      
      // Similarity to recent content
      similarityToRecent: this._checkSimilarityToRecent(content, recentContent),
      
      // Overall
      passed: false,
      score: 0,
      grade: 'F',
      suggestions: []
    };

    // Calculate overall pass
    results.passed = (
      results.isSurprising.passed &&
      results.wouldSave.passed &&
      !results.isTemplateGenerated.passed &&
      results.hasStopScrollSentence.found &&
      results.hasOriginalInsight.passed
    );

    // Calculate score
    results.score = this._calculateScore(results);
    results.grade = this._getGrade(results.score);

    // Generate suggestions
    results.suggestions = this._generateSuggestions(results);

    return results;
  }

  /**
   * Check if content is surprising
   */
  _checkSurprising(content) {
    const contentLower = content.toLowerCase();
    
    // Look for surprising elements
    const surprisingPatterns = [
      /nobody (tells|talks|shares|mentions)/i,
      /what nobody (tells|talks|shares|mentions)/i,
      /here's (what|the) (nobody|secret|truth|thing)/i,
      /the (secret|truth|thing|pattern|reality)/i,
      /actually (what|why|how|when)/i,
      /surprising(ly)?/i,
      /counterintuitive/i,
      /unexpected/i,
      /here's the thing nobody/i,
      /the thing about/i,
      /what (i|you) (never|don't) (hear|talk about|mention)/i
    ];

    const hasSurprising = surprisingPatterns.some(p => p.test(content));
    const hasSurprisingPhrase = /surprisingly|contrary|opposite|actually|rather|instead/i.test(content);
    
    // Check for cliché patterns (not surprising)
    const clichéPatterns = [
      'at the end of the day',
      'needless to say',
      'it goes without saying',
      'think outside the box',
      'low hanging fruit',
      'move the needle',
      'circle back',
      'synergy'
    ];

    const hasCliché = clichéPatterns.some(c => contentLower.includes(c));

    return {
      passed: hasSurprising && !hasCliché,
      hasSurprising,
      hasCliché,
      score: hasSurprising && !hasCliché ? 100 : (hasSurprising ? 60 : 30)
    };
  }

  /**
   * Check if someone would save this
   */
  _checkWouldSave(content) {
    const contentLower = content.toLowerCase();
    
    // Save-worthy elements
    const saveWorthy = [
      // Actionable content
      /step by step|here's how|how to|try this|do this/i,
      // Framework/principle
      /the (rule|principle|framework|system|process)/i,
      // Checklist/actionable
      /1\.|2\.|3\.|\d+ (steps?|things?|tips?|ways?)/i,
      // Key lessons
      /(key |main |most important |essential )?(lesson|takeaway|insight|point)/i,
      // Practical
      /(practical|useful|actionable) (advice|tips|strategies)/i
    ];

    const hasActionable = saveWorthy.some(p => p.test(content));
    const hasNumbers = /\d+/.test(content);
    const hasSpecifics = hasNumbers || /specifically|particular|exact/i.test(content);

    return {
      passed: hasActionable || hasSpecifics,
      hasActionable,
      hasSpecifics,
      score: (hasActionable ? 50 : 0) + (hasSpecifics ? 30 : 0) + 20
    };
  }

  /**
   * Check if this looks template-generated
   */
  _checkIfTemplateGenerated(content) {
    const contentLower = content.toLowerCase();
    
    // Template phrases that indicate generic generation
    const templatePhrases = [
      'in today\'s fast-paced world',
      'in this post/article/guide',
      'let me tell you',
      'here are some',
      'in conclusion',
      'to summarize',
      'in a nutshell',
      'the bottom line is',
      'it\'s important to note',
      'as you may know',
      'as mentioned earlier',
      'as i mentioned',
      'moving on to',
      'let\'s dive in',
      'without further ado',
      'first and foremost',
      'last but not least'
    ];

    const foundTemplates = templatePhrases.filter(p => contentLower.includes(p));
    
    // Check for very formulaic structure
    const paragraphs = content.split('\n\n');
    const hasFormulaicIntro = paragraphs[0]?.toLowerCase().startsWith('here\'s') && 
                              paragraphs[0]?.includes(':');
    
    return {
      passed: foundTemplates.length > 0 || hasFormulaicIntro,
      foundTemplates,
      hasFormulaicIntro,
      score: foundTemplates.length > 0 ? 0 : (hasFormulaicIntro ? 30 : 100)
    };
  }

  /**
   * Find the sentence that makes reader stop scrolling
   */
  _findStopScrollSentence(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let bestSentence = null;
    let bestScore = 0;
    
    for (const sentence of sentences) {
      const score = this._scoreStopScrollPotential(sentence.trim());
      if (score > bestScore) {
        bestScore = score;
        bestSentence = sentence.trim();
      }
    }

    return {
      found: bestScore >= 70,
      sentence: bestSentence,
      score: bestScore
    };
  }

  /**
   * Score stop-scroll potential of a sentence
   */
  _scoreStopScrollPotential(sentence) {
    let score = 50; // Base score
    
    const sentenceLower = sentence.toLowerCase();
    
    // Stop-scroll triggers
    const triggers = [
      { pattern: /what nobody (tells|talks|shares|mentions)/i, bonus: 40 },
      { pattern: /here's (what|the) (secret|truth|thing)/i, bonus: 35 },
      { pattern: /the (secret|truth|thing|pattern|reality)/i, bonus: 30 },
      { pattern: /hot take|unpopular|contrarian/i, bonus: 35 },
      { pattern: /plot twist|wait for it|breaking/i, bonus: 35 },
      { pattern: /would you believe/i, bonus: 30 },
      { pattern: /most people (don't|never|ignore|overlook)/i, bonus: 30 },
      { pattern: /the (#1|number one|biggest|main)/i, bonus: 25 },
      { pattern: /i was wrong/i, bonus: 35 },
      { pattern: /contrary to|opposite of|unlike/i, bonus: 25 },
      { pattern: /actually|really|truly|honestly/i, bonus: 15 },
      { pattern: /this changes everything/i, bonus: 35 },
      { pattern: /here's why/i, bonus: 25 },
      { pattern: /but first|before|until/i, bonus: 20 }
    ];

    triggers.forEach(({ pattern, bonus }) => {
      if (pattern.test(sentence)) {
        score += bonus;
      }
    });

    // Penalties
    if (sentence.length < 20) score -= 20;
    if (sentence.length > 150) score -= 15;
    if (sentenceLower.startsWith('in this')) score -= 30;
    if (sentenceLower.startsWith('here are')) score -= 30;
    if (sentenceLower.startsWith('today we')) score -= 30;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Build stop-scroll triggers
   */
  _buildStopScrollTriggers() {
    return {
      patterns: [
        'what nobody tells you',
        'here\'s the thing nobody',
        'the truth nobody talks about',
        'hot take',
        'plot twist',
        'wait for it',
        'would you believe',
        'i was wrong about',
        'contrary to popular belief',
        'here\'s why'
      ],
      starters: [
        'nobody is talking about',
        'the thing nobody mentions',
        'what nobody shares about',
        'the secret to',
        'the truth about'
      ]
    };
  }

  /**
   * Check if content has original insight
   */
  _checkHasOriginalInsight(content) {
    const contentLower = content.toLowerCase();
    
    const insightPatterns = [
      /the (real|actual|key|main|important) (insight|truth|lesson|takeaway|secret)/i,
      /what nobody (tells|shares|mentions|explains)/i,
      /here's (what|the) (nobody|secret|truth)/i,
      /the (pattern|principle|rule) behind/i,
      /most people (don't|never|ignore|overlook|fail to)/i,
      /(actually|really|truly) (the |a )?(truth|issue|problem|reason)/i,
      /the (real|actual|underlying) (issue|problem|reason|cause)/i,
      /(counterintuitive|surprising|unexpected) (truth|reality|fact)/i,
      /here's what (i|experts) (found|discovered|learned)/i
    ];

    const hasInsight = insightPatterns.some(p => p.test(content));
    
    // Check for generic advice
    const genericAdvice = [
      'be yourself',
      'never give up',
      'follow your dreams',
      'just do it',
      'stay positive',
      'work hard'
    ];

    const hasGeneric = genericAdvice.some(g => contentLower.includes(g));
    if (hasGeneric) {
      return { passed: false, hasInsight, hasGeneric, score: 20 };
    }

    return {
      passed: hasInsight,
      hasInsight,
      score: hasInsight ? 100 : 40
    };
  }

  /**
   * Check for concrete example
   */
  _checkHasConcreteExample(content) {
    const contentLower = content.toLowerCase();
    
    const examplePatterns = [
      /for example/i,
      /such as/i,
      /for instance/i,
      /scenario:/i,
      /case study/i,
      /when (i|we|you|someone)/i,
      /here's how (i|we|someone)/i,
      /real (example|story|scenario)/i,
      /this (happened|worked|failed)/i,
      /example:\s*\n/i
    ];

    const hasExample = examplePatterns.some(p => p.test(content));
    
    // Check for specific details
    const hasSpecifics = /\d+%|\d+x|\$\d+|\d+ (hours|days|weeks|months|years)/i.test(content);

    return {
      passed: hasExample || hasSpecifics,
      hasExample,
      hasSpecifics,
      score: (hasExample ? 60 : 0) + (hasSpecifics ? 40 : 0)
    };
  }

  /**
   * Check for actionable takeaway
   */
  _checkHasActionableTakeaway(content) {
    const contentLower = content.toLowerCase();
    
    const actionablePatterns = [
      /try this/i,
      /do this/i,
      /start (by|with)/i,
      /focus on/i,
      /the key (to|is)/i,
      /here's (how|what)/i,
      /step (1|one|2|two)/i,
      /the takeaway:/i,
      /lesson:/i,
      /action item/i,
      /remember to/i,
      /make sure (you|i)/i
    ];

    const hasActionable = actionablePatterns.some(p => p.test(content));
    const endsWithAction = /do this|try this|start today|begin now/i.test(content.slice(-100));

    return {
      passed: hasActionable || endsWithAction,
      hasActionable,
      score: hasActionable ? 100 : (endsWithAction ? 80 : 40)
    };
  }

  /**
   * Check for emotional engagement
   */
  _checkHasEmotionalEngagement(content) {
    const contentLower = content.toLowerCase();
    
    const emotionalPatterns = [
      /i remember/i,
      /i realized/i,
      /i learned/i,
      /i discovered/i,
      /i was (surprised|shocked|amazed)/i,
      /honestly/i,
      /actually/i,
      /really/i,
      /this hit me/i,
      /it clicked/i,
      /that changed (everything|my perspective)/i,
      /if you're like me/i,
      /sound familiar/i,
      /same here/i
    ];

    const hasEmotional = emotionalPatterns.some(p => p.test(content));
    const hasIStatements = (content.match(/\bI\b/g) || []).length >= 2;
    const hasYouStatements = (content.match(/\byou\b/gi) || []).length >= 2;

    return {
      passed: hasEmotional || (hasIStatements && hasYouStatements),
      hasEmotional,
      hasPersonalAddress: hasIStatements && hasYouStatements,
      score: (hasEmotional ? 60 : 0) + ((hasIStatements && hasYouStatements) ? 40 : 0)
    };
  }

  /**
   * Check for discussion-worthy idea
   */
  _checkHasDiscussionWorthy(content) {
    const contentLower = content.toLowerCase();
    
    const discussionPatterns = [
      /what's your (take|thoughts?|opinion)/i,
      /comment below/i,
      /agree or disagree/i,
      /let me know/i,
      /your experience/i,
      /have you (ever|never)/i,
      /would you/i,
      /should you/i,
      /hot take/i,
      /unpopular opinion/i,
      /controversial/i,
      /debate/i,
      /challenge/i
    ];

    const hasDiscussion = discussionPatterns.some(p => p.test(content));
    const hasQuestion = content.includes('?');

    return {
      passed: hasDiscussion || hasQuestion,
      hasDiscussion,
      hasQuestion,
      score: (hasDiscussion ? 70 : 0) + (hasQuestion ? 30 : 0)
    };
  }

  /**
   * Check similarity to recent content
   */
  _checkSimilarityToRecent(content, recentContent) {
    if (!recentContent || recentContent.length === 0) {
      return { passed: true, maxSimilarity: 0 };
    }

    const contentLower = content.toLowerCase();
    let maxSimilarity = 0;
    let mostSimilarContent = null;

    for (const recent of recentContent) {
      const recentLower = recent.toLowerCase();
      
      // Simple similarity check
      const words = contentLower.split(/\s+/);
      const recentWords = recentLower.split(/\s+/);
      
      const commonWords = words.filter(w => recentWords.includes(w));
      const similarity = commonWords.length / Math.max(words.length, recentWords.length);
      
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        mostSimilarContent = recent;
      }
    }

    return {
      passed: maxSimilarity < 0.6,
      maxSimilarity,
      mostSimilarContent: mostSimilarContent?.substring(0, 100),
      score: maxSimilarity < 0.6 ? 100 : (1 - maxSimilarity) * 100
    };
  }

  /**
   * Build common phrases to avoid
   */
  _buildCommonPhrases() {
    return [
      'at the end of the day',
      'needless to say',
      'it goes without saying',
      'think outside the box',
      'low hanging fruit',
      'move the needle',
      'circle back',
      'synergy',
      'leverage',
      'paradigm shift',
      'disruptive',
      'game-changer',
      'best practice',
      'next steps',
      'in conclusion',
      'to summarize',
      'in a nutshell'
    ];
  }

  /**
   * Build template patterns
   */
  _buildTemplatePatterns() {
    return [
      /^here's (what|the)/i,
      /^in today'?s (article|post|guide|world)/i,
      /^let me (tell|share|explain)/i,
      /^here are \d+ (tips|ways|things)/i,
      /^first (and foremost|ly)/i,
      /^last but not least/i,
      /^moving on to/i,
      /^without further ado/i
    ];
  }

  /**
   * Calculate overall score
   */
  _calculateScore(results) {
    const weights = {
      isSurprising: 0.2,
      wouldSave: 0.15,
      isTemplateGenerated: 0.2,
      hasStopScrollSentence: 0.15,
      hasOriginalInsight: 0.15,
      hasConcreteExample: 0.05,
      hasActionableTakeaway: 0.05,
      hasEmotionalEngagement: 0.025,
      hasDiscussionWorthy: 0.025,
      similarityToRecent: 0.1
    };

    let totalScore = 0;
    let totalWeight = 0;

    if (results.isSurprising.passed) totalScore += weights.isSurprising * results.isSurprising.score;
    totalWeight += weights.isSurprising;

    if (results.wouldSave.passed) totalScore += weights.wouldSave * results.wouldSave.score;
    totalWeight += weights.wouldSave;

    // Template check - lower score if template detected
    if (!results.isTemplateGenerated.passed) {
      totalScore += weights.isTemplateGenerated * results.isTemplateGenerated.score;
    }
    totalWeight += weights.isTemplateGenerated;

    if (results.hasStopScrollSentence.found) {
      totalScore += weights.hasStopScrollSentence * results.hasStopScrollSentence.score;
    }
    totalWeight += weights.hasStopScrollSentence;

    if (results.hasOriginalInsight.passed) {
      totalScore += weights.hasOriginalInsight * results.hasOriginalInsight.score;
    }
    totalWeight += weights.hasOriginalInsight;

    totalScore += weights.hasConcreteExample * results.hasConcreteExample.score;
    totalWeight += weights.hasConcreteExample;

    totalScore += weights.hasActionableTakeaway * results.hasActionableTakeaway.score;
    totalWeight += weights.hasActionableTakeaway;

    if (results.hasEmotionalEngagement.passed) {
      totalScore += weights.hasEmotionalEngagement * results.hasEmotionalEngagement.score;
    }
    totalWeight += weights.hasEmotionalEngagement;

    if (results.hasDiscussionWorthy.passed) {
      totalScore += weights.hasDiscussionWorthy * results.hasDiscussionWorthy.score;
    }
    totalWeight += weights.hasDiscussionWorthy;

    if (results.similarityToRecent.passed) {
      totalScore += weights.similarityToRecent * results.similarityToRecent.score;
    }
    totalWeight += weights.similarityToRecent;

    return Math.round(totalScore / totalWeight);
  }

  /**
   * Get grade from score
   */
  _getGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Generate suggestions for improvement
   */
  _generateSuggestions(results) {
    const suggestions = [];

    if (!results.isSurprising.passed) {
      suggestions.push({
        priority: 'high',
        issue: 'Not surprising enough',
        suggestion: 'Add a counterintuitive observation, secret, or truth nobody mentions'
      });
    }

    if (results.isTemplateGenerated.passed) {
      suggestions.push({
        priority: 'high',
        issue: 'Sounds template-generated',
        suggestion: 'Remove formulaic phrases like "here\'s what", "in today\'s world", "in conclusion"'
      });
    }

    if (!results.wouldSave.passed) {
      suggestions.push({
        priority: 'high',
        issue: 'Not save-worthy',
        suggestion: 'Add specific numbers, steps, or actionable advice'
      });
    }

    if (!results.hasStopScrollSentence.found) {
      suggestions.push({
        priority: 'high',
        issue: 'No stop-scroll hook',
        suggestion: 'Start with "What nobody tells you about...", "Hot take:", or "The truth about..."'
      });
    }

    if (!results.hasOriginalInsight.passed) {
      suggestions.push({
        priority: 'medium',
        issue: 'Lacks original insight',
        suggestion: 'Share a unique perspective, pattern, or lesson learned'
      });
    }

    if (!results.hasConcreteExample.passed) {
      suggestions.push({
        priority: 'medium',
        issue: 'No concrete example',
        suggestion: 'Add a real scenario, case study, or specific situation'
      });
    }

    if (!results.hasActionableTakeaway.passed) {
      suggestions.push({
        priority: 'medium',
        issue: 'Not actionable',
        suggestion: 'End with a clear action step or "try this" advice'
      });
    }

    if (!results.hasEmotionalEngagement.passed) {
      suggestions.push({
        priority: 'low',
        issue: 'Lacks emotional connection',
        suggestion: 'Add personal experience or relatable emotional content'
      });
    }

    if (!results.hasDiscussionWorthy.passed) {
      suggestions.push({
        priority: 'low',
        issue: 'Won\'t drive discussion',
        suggestion: 'Add a question or "agree/disagree" prompt'
      });
    }

    if (!results.similarityToRecent.passed) {
      suggestions.push({
        priority: 'high',
        issue: 'Too similar to recent content',
        suggestion: 'Take a different angle, use different examples'
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Rewrite weak sections based on results
   */
  rewrite(content, results) {
    let rewritten = content;

    // Rewrite hook if not surprising
    if (!results.isSurprising.passed || !results.hasStopScrollSentence.found) {
      rewritten = this._rewriteHook(rewritten);
    }

    // Remove template phrases
    if (results.isTemplateGenerated.passed) {
      rewritten = this._removeTemplatePhrases(rewritten);
    }

    // Add stop-scroll opener if missing
    if (!results.hasStopScrollSentence.found) {
      rewritten = this._addStopScrollOpener(rewritten);
    }

    // Add actionable takeaway if missing
    if (!results.hasActionableTakeaway.passed) {
      rewritten = this._addActionableTakeaway(rewritten);
    }

    // Add concrete example if missing
    if (!results.hasConcreteExample.passed) {
      rewritten = this._addConcreteExample(rewritten);
    }

    return rewritten;
  }

  /**
   * Rewrite hook section
   */
  _rewriteHook(content) {
    const paragraphs = content.split('\n\n');
    if (paragraphs.length === 0) return content;

    const firstPara = paragraphs[0];
    const sentences = firstPara.split(/[.!?]+/);
    
    if (sentences.length === 0) return content;

    // Generate new hook
    const newHooks = [
      'What nobody tells you about this:',
      'Here\'s the thing nobody talks about:',
      'The truth nobody mentions:',
      'Hot take:',
      'Plot twist:',
      'The secret nobody shares:'
    ];

    const newHook = newHooks[Math.floor(Math.random() * newHooks.length)];
    
    // Replace first sentence if it's weak
    const firstSentence = sentences[0].trim();
    if (firstSentence.length > 0) {
      sentences[0] = newHook + ' ' + firstSentence;
    }

    paragraphs[0] = sentences.join('.');
    return paragraphs.join('\n\n');
  }

  /**
   * Remove template phrases
   */
  _removeTemplatePhrases(content) {
    let result = content;
    
    const replacements = {
      'in today\'s fast-paced world': '',
      'in today\'s world': '',
      'in this post': '',
      'in this article': '',
      'in this guide': '',
      'let me tell you': '',
      'here are some': '',
      'in conclusion,': '',
      'to summarize,': '',
      'in a nutshell,': '',
      'the bottom line is': 'Key point:',
      'it\'s important to note': 'Note:',
      'as you may know': '',
      'as mentioned earlier': '',
      'as i mentioned': '',
      'moving on to': '',
      'let\'s dive in': '',
      'without further ado': '',
      'first and foremost': 'First,',
      'last but not least': 'Finally,'
    };

    Object.entries(replacements).forEach(([phrase, replacement]) => {
      result = result.replace(new RegExp(phrase, 'gi'), replacement);
    });

    // Clean up double spaces
    result = result.replace(/\s{2,}/g, ' ');

    return result.trim();
  }

  /**
   * Add stop-scroll opener
   */
  _addStopScrollOpener(content) {
    const openers = [
      'What nobody tells you about this topic:\n\n',
      'Here\'s the thing nobody talks about:\n\n',
      'The truth nobody mentions:\n\n',
      'Hot take:\n\n'
    ];

    const opener = openers[Math.floor(Math.random() * openers.length)];
    return opener + content;
  }

  /**
   * Add actionable takeaway
   */
  _addActionableTakeaway(content) {
    const takeaways = [
      '\n\nThe takeaway: Focus on the fundamentals. Everything else is noise.',
      '\n\nTry this: Start with the smallest possible version and iterate.',
      '\n\nKey lesson: Consistency beats intensity every time.'
    ];

    const takeaway = takeaways[Math.floor(Math.random() * takeaways.length)];
    return content + takeaway;
  }

  /**
   * Add concrete example
   */
  _addConcreteExample(content) {
    const examples = [
      '\n\nFor example: Someone who struggled with this started by focusing on just one thing. Within weeks, they saw real progress.',
      '\n\nScenario: If you tried everything and nothing worked, start here: simplify. Often the solution is doing less, not more.'
    ];

    const example = examples[Math.floor(Math.random() * examples.length)];
    
    // Insert before last paragraph
    const paragraphs = content.split('\n\n');
    if (paragraphs.length > 1) {
      paragraphs.splice(-1, 0, example.trim());
      return paragraphs.join('\n\n');
    }

    return content + example;
  }
}

export default OriginalityEngine;

/**
 * ObservationEngine
 * Generates dozens of structured observations about a topic
 * These observations drive the writing process
 */

export class ObservationEngine {
  constructor(topicPacks) {
    this.topicPacks = topicPacks;
  }

  /**
   * Generate observations for a topic
   * Returns at least 20 structured observations
   */
  generateObservations(topic, options = {}) {
    const {
      count = 25,
      types = ['surprising', 'emotional', 'controversial', 'practical', 'educational', 
                'mistake', 'insight', 'comparison', 'myth', 'prediction', 'trend', 
                'story', 'analogy', 'statistic', 'challenge', 'question', 'quote',
                'example', 'warning', 'tip', 'fact', 'pattern', 'reframe']
    } = options;

    const observations = [];
    const pack = this.topicPacks?.getPack(topic);

    // Generate from topic pack data
    if (pack) {
      observations.push(...this._generateFromPack(pack, topic, count));
    }

    // Fill remaining with generated observations
    while (observations.length < count) {
      const type = types[observations.length % types.length];
      const observation = this._generateSingleObservation(topic, type, pack);
      if (observation && !this._isDuplicate(observation, observations)) {
        observations.push(observation);
      }
    }

    // Rank observations
    const ranked = this._rankObservations(observations, options);

    return ranked.slice(0, count);
  }

  /**
   * Generate observations from topic pack
   */
  _generateFromPack(pack, topic, targetCount) {
    const observations = [];

    // Facts
    if (pack.facts) {
      pack.facts.slice(0, 3).forEach(fact => {
        observations.push({
          type: 'fact',
          text: fact,
          confidence: 0.9,
          category: 'knowledge',
          useCase: 'hook, evidence'
        });
      });
    }

    // Pain points
    if (pack.painPoints) {
      pack.painPoints.slice(0, 3).forEach(pain => {
        observations.push({
          type: 'pain_point',
          text: pain,
          confidence: 0.85,
          category: 'emotional',
          useCase: 'hook, insight'
        });
      });
    }

    // Misconceptions
    if (pack.misconceptions) {
      pack.misconceptions.slice(0, 3).forEach(mis => {
        observations.push({
          type: 'myth',
          myth: mis.myth,
          truth: mis.truth,
          text: `${mis.myth} - ${mis.truth}`,
          confidence: 0.9,
          category: 'insight',
          useCase: 'hook, reframe'
        });
      });
    }

    // Trends
    if (pack.trends) {
      pack.trends.slice(0, 2).forEach(trend => {
        observations.push({
          type: 'trend',
          text: trend,
          confidence: 0.75,
          category: 'prediction',
          useCase: 'hook, example'
        });
      });
    }

    // Expert tips
    if (pack.expertTips) {
      pack.expertTips.slice(0, 2).forEach(tip => {
        observations.push({
          type: 'expert_tip',
          text: tip,
          confidence: 0.8,
          category: 'practical',
          useCase: 'advice, lesson'
        });
      });
    }

    // Beginner mistakes
    if (pack.beginnerMistakes) {
      pack.beginnerMistakes.slice(0, 2).forEach(mistake => {
        observations.push({
          type: 'mistake',
          text: mistake,
          confidence: 0.85,
          category: 'warning',
          useCase: 'hook, lesson'
        });
      });
    }

    // Practical examples
    if (pack.practicalExamples) {
      pack.practicalExamples.slice(0, 2).forEach(ex => {
        observations.push({
          type: 'example',
          scenario: ex.scenario,
          approach: ex.approach,
          outcome: ex.outcome,
          text: `${ex.scenario}: ${ex.approach}`,
          confidence: 0.9,
          category: 'evidence',
          useCase: 'example, explanation'
        });
      });
    }

    // Comparisons
    if (pack.comparisons) {
      pack.comparisons.slice(0, 2).forEach(comp => {
        observations.push({
          type: 'comparison',
          subject: comp.subject,
          versus: comp.versus,
          betterFor: comp.betterFor,
          nuance: comp.nuance,
          text: `${comp.subject}: ${comp.versus}`,
          confidence: 0.85,
          category: 'analysis',
          useCase: 'explanation, comparison'
        });
      });
    }

    return observations;
  }

  /**
   * Generate a single observation
   */
  _generateSingleObservation(topic, type, pack) {
    const generators = {
      surprising: () => this._generateSurprising(topic, pack),
      emotional: () => this._generateEmotional(topic, pack),
      controversial: () => this._generateControversial(topic, pack),
      practical: () => this._generatePractical(topic, pack),
      educational: () => this._generateEducational(topic, pack),
      mistake: () => this._generateMistake(topic, pack),
      insight: () => this._generateInsight(topic, pack),
      comparison: () => this._generateComparison(topic, pack),
      myth: () => this._generateMyth(topic, pack),
      prediction: () => this._generatePrediction(topic, pack),
      trend: () => this._generateTrend(topic, pack),
      story: () => this._generateStory(topic, pack),
      analogy: () => this._generateAnalogy(topic, pack),
      statistic: () => this._generateStatistic(topic, pack),
      challenge: () => this._generateChallenge(topic, pack),
      question: () => this._generateQuestion(topic, pack),
      quote: () => this._generateQuote(topic, pack),
      example: () => this._generateExample(topic, pack),
      warning: () => this._generateWarning(topic, pack),
      tip: () => this._generateTip(topic, pack),
      fact: () => this._generateFact(topic, pack),
      pattern: () => this._generatePattern(topic, pack),
      reframe: () => this._generateReframe(topic, pack)
    };

    const generator = generators[type];
    return generator ? generator() : null;
  }

  _generateSurprising(topic, pack) {
    const statements = [
      `Most people underestimate ${topic} by a factor of 3`,
      `The counterintuitive truth about ${topic} is that less is often more`,
      `Nobody talks about the hidden cost of ${topic}`,
      `The ${topic} industry has been lying to you`,
      `What ${topic} experts won't tell you`,
      `The ${topic} secret nobody shares`
    ];

    return {
      type: 'surprising',
      text: statements[Math.floor(Math.random() * statements.length)],
      confidence: 0.7,
      category: 'hook',
      useCase: 'hook, attention'
    };
  }

  _generateEmotional(topic, pack) {
    const emotions = [
      `You\'ve been avoiding ${topic} and it\'s hurting you`,
      `The fear of getting ${topic} wrong is holding you back`,
      `Imagine if you mastered ${topic} - how would that change your day?`,
      `Most people feel overwhelmed by ${topic} but don\'t admit it`,
      `The frustration with ${topic} is real and valid`,
      `What if you\'ve been thinking about ${topic} completely wrong?`
    ];

    return {
      type: 'emotional',
      text: emotions[Math.floor(Math.random() * emotions.length)],
      confidence: 0.65,
      category: 'emotional',
      useCase: 'hook, connection'
    };
  }

  _generateControversial(topic, pack) {
    const opinions = [
      `Unpopular take: ${topic} is overrated`,
      `Hot take: stop focusing on ${topic}`,
      `Controversial opinion: ${topic} doesn\'t matter as much as you think`,
      `The ${topic} industry wants you to believe this lie`,
      `Why traditional advice about ${topic} is wrong`,
      `Here\'s why I disagree with most ${topic} experts`
    ];

    return {
      type: 'controversial',
      text: opinions[Math.floor(Math.random() * opinions.length)],
      confidence: 0.6,
      category: 'opinion',
      useCase: 'hook, engagement'
    };
  }

  _generatePractical(topic, pack) {
    const tips = [
      `How to actually improve at ${topic} in 30 days`,
      `The ${topic} framework that changed my approach`,
      `3 steps to better ${topic} starting today`,
      `What most ${topic} guides get wrong`,
      `The ${topic} checklist experts actually use`,
      `How to measure ${topic} improvement`
    ];

    return {
      type: 'practical',
      text: tips[Math.floor(Math.random() * tips.length)],
      confidence: 0.75,
      category: 'actionable',
      useCase: 'advice, lesson'
    };
  }

  _generateEducational(topic, pack) {
    const lessons = [
      `Understanding ${topic} in 5 minutes`,
      `The ${topic} fundamentals most people skip`,
      `Why ${topic} works (explained simply)`,
      `How ${topic} actually functions`,
      `The science behind ${topic}`,
      `What ${topic} actually means`
    ];

    return {
      type: 'educational',
      text: lessons[Math.floor(Math.random() * lessons.length)],
      confidence: 0.7,
      category: 'knowledge',
      useCase: 'explanation, lesson'
    };
  }

  _generateMistake(topic, pack) {
    const mistakes = [
      `The #1 mistake people make with ${topic}`,
      `You\'re doing ${topic} wrong and don\'t know it`,
      `Why beginners fail at ${topic}`,
      `The ${topic} mistake that wastes your time`,
      `Most people quit ${topic} because of this mistake`,
      `The ${topic} trap and how to avoid it`
    ];

    return {
      type: 'mistake',
      text: mistakes[Math.floor(Math.random() * mistakes.length)],
      confidence: 0.75,
      category: 'warning',
      useCase: 'hook, lesson'
    };
  }

  _generateInsight(topic, pack) {
    const insights = [
      `The key insight about ${topic} nobody discusses`,
      `What makes ${topic} actually work`,
      `The pattern behind successful ${topic}`,
      `Why some people excel at ${topic} while others struggle`,
      `The real reason ${topic} matters`,
      `What separates ${topic} experts from beginners`
    ];

    return {
      type: 'insight',
      text: insights[Math.floor(Math.random() * insights.length)],
      confidence: 0.7,
      category: 'insight',
      useCase: 'hook, core insight'
    };
  }

  _generateComparison(topic, pack) {
    return {
      type: 'comparison',
      text: `${topic} vs traditional approach: which wins?`,
      subject: topic,
      versus: 'traditional approach',
      confidence: 0.65,
      category: 'analysis',
      useCase: 'explanation, comparison'
    };
  }

  _generateMyth(topic, pack) {
    const myths = [
      `Myth: You need expensive tools for ${topic}`,
      `Myth: ${topic} takes years to master`,
      `Myth: Natural talent matters more than practice for ${topic}`,
      `Myth: There\'s one right way to do ${topic}`,
      `Myth: ${topic} is only for experts`
    ];

    return {
      type: 'myth',
      text: myths[Math.floor(Math.random() * myths.length)],
      myth: myths[Math.floor(Math.random() * myths.length)].replace('Myth: ', ''),
      truth: `The reality is different for ${topic}`,
      confidence: 0.7,
      category: 'reframe',
      useCase: 'hook, reframe'
    };
  }

  _generatePrediction(topic, pack) {
    const predictions = [
      `${topic} will be essential in 5 years`,
      `The future of ${topic} looks like this`,
      `What ${topic} will look like in 2030`,
      `Prepare for this ${topic} shift`,
      `${topic} is about to change dramatically`
    ];

    return {
      type: 'prediction',
      text: predictions[Math.floor(Math.random() * predictions.length)],
      confidence: 0.55,
      category: 'future',
      useCase: 'hook, trend'
    };
  }

  _generateTrend(topic, pack) {
    const trends = [
      `The emerging ${topic} trend nobody notices`,
      `Why ${topic} is gaining momentum`,
      `The ${topic} movement growing quietly`,
      `How ${topic} is evolving`,
      `The ${topic} shift happening now`
    ];

    return {
      type: 'trend',
      text: trends[Math.floor(Math.random() * trends.length)],
      confidence: 0.6,
      category: 'trend',
      useCase: 'hook, context'
    };
  }

  _generateStory(topic, pack) {
    return {
      type: 'story',
      text: `The story of someone who mastered ${topic}`,
      premise: `A beginner struggles with ${topic}`,
      climax: `Discovers the key insight`,
      resolution: `Transforms their approach to ${topic}`,
      confidence: 0.6,
      category: 'narrative',
      useCase: 'story, engagement'
    };
  }

  _generateAnalogy(topic, pack) {
    const analogies = [
      `${topic} is like learning to drive - scary at first, automatic later`,
      `${topic} is similar to building muscle - it requires consistent strain`,
      `Think of ${topic} like learning a language - immersion beats textbooks`,
      `${topic} works like compound interest - small gains accumulate`
    ];

    return {
      type: 'analogy',
      text: analogies[Math.floor(Math.random() * analogies.length)],
      subject: topic,
      analogy: analogies[Math.floor(Math.random() * analogies.length)],
      confidence: 0.6,
      category: 'explanation',
      useCase: 'explanation, hook'
    };
  }

  _generateStatistic(topic, pack) {
    const stats = [
      `${Math.floor(Math.random() * 90 + 10)}% of people struggle with ${topic}`,
      `The average person spends ${Math.floor(Math.random() * 10 + 1)} hours weekly on ${topic}`,
      `Studies show ${Math.floor(Math.random() * 70 + 30)}% improvement with proper ${topic}`,
      `${Math.floor(Math.random() * 5 + 1)}x more effective than traditional ${topic} methods`
    ];

    return {
      type: 'statistic',
      text: stats[Math.floor(Math.random() * stats.length)],
      confidence: 0.5,
      category: 'evidence',
      useCase: 'hook, evidence'
    };
  }

  _generateChallenge(topic, pack) {
    const challenges = [
      `The hardest part about ${topic} is not what you think`,
      `Most people quit ${topic} here`,
      `The ${topic} plateau nobody warns you about`,
      `When ${topic} gets frustrating - and how to push through`,
      `The moment most people give up on ${topic}`
    ];

    return {
      type: 'challenge',
      text: challenges[Math.floor(Math.random() * challenges.length)],
      confidence: 0.7,
      category: 'struggle',
      useCase: 'hook, connection'
    };
  }

  _generateQuestion(topic, pack) {
    const questions = [
      `What if you\'ve been approaching ${topic} wrong?`,
      `Why do some people excel at ${topic} while others plateau?`,
      `What would change if you mastered ${topic}?`,
      `How much time are you wasting on ${topic}?`,
      `What\'s the real cost of ignoring ${topic}?`,
      `When did ${topic} become harder than it needs to be?`
    ];

    return {
      type: 'question',
      text: questions[Math.floor(Math.random() * questions.length)],
      confidence: 0.65,
      category: 'curiosity',
      useCase: 'hook, engagement'
    };
  }

  _generateQuote(topic, pack) {
    const quotes = [
      `"The best time to master ${topic} was 5 years ago. The second best time is now."`,
      `"${topic} is not about perfection. It\'s about progress."`,
      `"Most people overestimate what ${topic} takes. They underestimate what they\'re capable of."`,
      `"The only bad ${topic} strategy is no strategy."`
    ];

    return {
      type: 'quote',
      text: quotes[Math.floor(Math.random() * quotes.length)],
      confidence: 0.5,
      category: 'inspiration',
      useCase: 'hook, CTA'
    };
  }

  _generateExample(topic, pack) {
    if (pack?.practicalExamples?.[0]) {
      const ex = pack.practicalExamples[0];
      return {
        type: 'example',
        scenario: ex.scenario,
        approach: ex.approach,
        outcome: ex.outcome,
        text: `${ex.scenario}: ${ex.approach}`,
        confidence: 0.9,
        category: 'evidence',
        useCase: 'example, explanation'
      };
    }

    return {
      type: 'example',
      text: `Real example: How someone went from struggling with ${topic} to mastering it`,
      scenario: 'Starting with no experience',
      approach: 'Followed a structured approach',
      outcome: 'Significant improvement in weeks',
      confidence: 0.65,
      category: 'evidence',
      useCase: 'example, proof'
    };
  }

  _generateWarning(topic, pack) {
    const warnings = [
      `Stop doing this with ${topic} immediately`,
      `The ${topic} trap that wastes months`,
      `Why your ${topic} approach isn\'t working`,
      `The warning sign you\'re doing ${topic} wrong`,
      `Don\'t make this ${topic} mistake`
    ];

    return {
      type: 'warning',
      text: warnings[Math.floor(Math.random() * warnings.length)],
      confidence: 0.7,
      category: 'warning',
      useCase: 'hook, lesson'
    };
  }

  _generateTip(topic, pack) {
    const tips = [
      `Quick ${topic} win: start here`,
      `The ${topic} shortcut experts use`,
      `Pro tip for better ${topic}`,
      `The ${topic} hack nobody talks about`,
      `One change that improves ${topic} immediately`
    ];

    return {
      type: 'tip',
      text: tips[Math.floor(Math.random() * tips.length)],
      confidence: 0.65,
      category: 'actionable',
      useCase: 'advice, lesson'
    };
  }

  _generateFact(topic, pack) {
    const facts = [
      `${topic} has been practiced for centuries in different forms`,
      `The average expert spends ${Math.floor(Math.random() * 10 + 1)} years mastering ${topic}`,
      `There are ${Math.floor(Math.random() * 1000 + 500)}+ resources on ${topic} - most are useless`,
      `The ${topic} industry is worth $${Math.floor(Math.random() * 100 + 10)}B`
    ];

    return {
      type: 'fact',
      text: facts[Math.floor(Math.random() * facts.length)],
      confidence: 0.6,
      category: 'knowledge',
      useCase: 'hook, evidence'
    };
  }

  _generatePattern(topic, pack) {
    const patterns = [
      `The pattern: struggle → plateau → breakthrough → mastery`,
      `Why ${topic} follows the 80/20 rule`,
      `The ${topic} cycle most people get stuck in`,
      `Success with ${topic} follows a predictable pattern`
    ];

    return {
      type: 'pattern',
      text: patterns[Math.floor(Math.random() * patterns.length)],
      confidence: 0.65,
      category: 'insight',
      useCase: 'explanation, insight'
    };
  }

  _generateReframe(topic, pack) {
    const reframes = [
      `${topic} isn\'t about doing more. It\'s about doing differently.`,
      `Think of ${topic} as a skill, not a talent.`,
      `${topic} isn\'t the goal. The outcome is.`,
      `Stop optimizing ${topic}. Start understanding it.`,
      `The ${topic} obsession is holding you back.`
    ];

    return {
      type: 'reframe',
      text: reframes[Math.floor(Math.random() * reframes.length)],
      subject: topic,
      original: 'common misconception',
      reframed: reframes[Math.floor(Math.random() * reframes.length)],
      confidence: 0.7,
      category: 'reframe',
      useCase: 'hook, insight'
    };
  }

  /**
   * Rank observations by quality and relevance
   */
  _rankObservations(observations, options = {}) {
    const { goal = 'engage', personality = 'default' } = options;

    // Score each observation
    const scored = observations.map(obs => {
      let score = 0;

      // Confidence weight
      score += (obs.confidence || 0.5) * 30;

      // Type relevance based on goal
      const goalTypes = {
        engage: ['surprising', 'question', 'controversial', 'emotional', 'story'],
        educate: ['educational', 'example', 'fact', 'insight', 'explanation'],
        inspire: ['story', 'emotional', 'quote', 'reframe', 'challenge'],
        sell: ['practical', 'tip', 'example', 'statistic', 'comparison']
      };

      const relevantTypes = goalTypes[goal] || goalTypes.engage;
      if (relevantTypes.includes(obs.type)) {
        score += 20;
      }

      // Bonus for examples and concrete details
      if (obs.example || obs.scenario || obs.outcome) {
        score += 15;
      }

      // Bonus for being specific
      if (obs.text && (obs.text.includes(':') || obs.text.includes('-'))) {
        score += 10;
      }

      // Bonus for myth/truth pairs
      if (obs.myth && obs.truth) {
        score += 15;
      }

      return { ...obs, score };
    });

    // Sort by score descending
    return scored.sort((a, b) => b.score - a.score);
  }

  /**
   * Check for duplicate observations
   */
  _isDuplicate(observation, existing) {
    const text = observation.text?.toLowerCase() || '';
    
    return existing.some(existingObs => {
      const existingText = existingObs.text?.toLowerCase() || '';
      return existingText.includes(text.substring(0, 30)) ||
             text.includes(existingText.substring(0, 30));
    });
  }

  /**
   * Select best observation for a section
   */
  selectForSection(section, observations, usedTypes = []) {
    const sectionTypes = {
      hook: ['surprising', 'question', 'controversial', 'emotional', 'statistic', 'myth', 'story'],
      insight: ['insight', 'reframe', 'pattern', 'comparison', 'mistake'],
      explanation: ['educational', 'analogy', 'fact', 'explanation'],
      example: ['example', 'scenario', 'story', 'case study'],
      advice: ['practical', 'tip', 'warning', 'challenge'],
      cta: ['tip', 'quote', 'question']
    };

    const preferredTypes = sectionTypes[section] || ['surprising'];

    // First try preferred types
    let candidates = observations.filter(obs => 
      preferredTypes.includes(obs.type) && !usedTypes.includes(obs.type)
    );

    if (candidates.length === 0) {
      // Fall back to any unused
      candidates = observations.filter(obs => !usedTypes.includes(obs.type));
    }

    if (candidates.length === 0) {
      return observations[0];
    }

    return candidates[0];
  }
}

export default ObservationEngine;
